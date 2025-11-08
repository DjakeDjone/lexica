import Fuse from "fuse.js";

export type SearchResult = {
    id: string;
    title: string;
    tag?: string;
    titles: string[];
    level: number;
    description: string;
    content?: string;
    score: number;
    url: string;
};

export type SearchResultFolder = {
    id: string;
    title: string;
    url: string;
    children: SearchResultFolder[];
};

export type SearchResultsResponse = {
    results: SearchResult[];
    folders: SearchResultFolder[];
    total: number;
    page: number;
    pageSize: number;
};

export const extraPages = [
    {
        id: 'lexa',
        titles: ['Lexa'],
        title: 'Lexa',
        description: 'Chat with Lexa, your AI assistant for all things Lexica.',
        content: 'Chat with Lexa, your AI assistant for all things Lexica.',
        level: 1,
        url: '/lexa',
    }
];


export const extendSearchResults = (results: SearchResult[]): SearchResult[] => {
    const extendedResults = [...results];

    // add extra pages if they are not already in results
    extraPages.forEach(page => {
        if (!extendedResults.find(r => r.id === page.id)) {
            extendedResults.push({
                ...page,
                score: 1, // low score to not interfere with real results
            });
        }
    });

    return extendedResults;
}

// Cache for Fuse instances to avoid recreating them
const fuseCache = new Map<string, Fuse<any>>();

const getFuseInstance = (section: SearchResult): Fuse<any> => {
    const cacheKey = section.id;
    if (!fuseCache.has(cacheKey)) {
        const fuse = new Fuse([section], {
            keys: ['titles', 'content'],
            includeScore: true,
            threshold: 0.4,
            distance: 100
        });
        fuseCache.set(cacheKey, fuse);
    }
    return fuseCache.get(cacheKey)!;
};

export const scoreSection = (section: SearchResult, query: string): number => {
    const words = query.split(/\s+/).filter(w => w.length > 0);
    let score = 0;
    let hasAnyMatch = false;

    words.forEach(word => {
        const wordLower = word.toLowerCase();
        let wordScore = 0;
        let foundMatch = false;

        // Check for exact matches in titles (highest priority)
        const exactTitleMatch = section.titles.some((title: string) =>
            title.toLowerCase().split(/\s+/).some(titleWord => titleWord === wordLower)
        );
        if (exactTitleMatch) {
            wordScore += 20; // High boost for exact word match in title
            foundMatch = true;
        } else {
            // Check for word boundary matches in titles (e.g., "median" matches "Median" but not "Medien")
            const wordBoundaryTitleMatch = section.titles.some((title: string) => {
                const regex = new RegExp(`\\b${word}\\b`, 'i');
                return regex.test(title);
            });
            if (wordBoundaryTitleMatch) {
                wordScore += 15; // Good boost for word boundary match in title
                foundMatch = true;
            } else {
                // Check for partial matches in titles (lowest priority for titles)
                const partialTitleMatch = section.titles.some((title: string) =>
                    title.toLowerCase().includes(wordLower)
                );
                if (partialTitleMatch) {
                    wordScore += 5; // Small boost for partial match in title
                    foundMatch = true;
                }
            }
        }

        // Check for exact matches in content
        if (section.content) {
            const contentLower = section.content.toLowerCase();
            const exactContentMatch = contentLower.split(/\s+/).some(contentWord => 
                contentWord.replace(/[.,!?;:()]/g, '') === wordLower
            );
            if (exactContentMatch) {
                wordScore += 10; // Good boost for exact word match in content
                foundMatch = true;
            } else {
                // Check for word boundary matches in content
                const regex = new RegExp(`\\b${word}\\b`, 'i');
                if (regex.test(section.content)) {
                    wordScore += 8; // Decent boost for word boundary match in content
                    foundMatch = true;
                }
            }
        }

        // Use fuzzy matching as a fallback for both titles and content
        if (!foundMatch) {
            const fuse = getFuseInstance(section);
            const result = fuse.search(word);
            if (result.length > 0 && result[0].score !== undefined) {
                // Score based on how good the fuzzy match is (0 = perfect, 1 = worst)
                const fuzzyScore = Math.max(0, 4 - (result[0].score * 4));
                wordScore += fuzzyScore; // Max 4 points for fuzzy matches
                foundMatch = true;
            }
        }

        if (foundMatch) {
            hasAnyMatch = true;
        }

        score += wordScore;

        // reward if the id has no 'id'
        if (section.id && !section.id.includes(' ')) {
            score += 2;
        }
    });

    // Only filter out if no matches found at all
    if (!hasAnyMatch || score < 1) {
        return 0;
    }

    // Boost score for matches in higher-level sections
    score += Math.max(0, 10 - section.level * 3); // Higher level (lower number) gets more points

    return score;
};

export const processSearchResults = (sections: any[], query: string): SearchResult[] => {
    sections = extendSearchResults(sections);
    const results: SearchResult[] = sections.map((section) => {
        const score = scoreSection(section, query);
        const description = section.content.length > 200 ? section.content.substring(0, 197) + '...' : section.content;
        // remove the '/' from the id if it exists
        if (section.id.startsWith('/')) {
            section.id = section.id.substring(1);
        }
        return {
            id: section.id,
            title: section.titles[section.titles.length - 1],
            tag: section.titles.length > 1 ? section.titles[section.titles.length - 2] : undefined,
            description,
            content: section.content,
            titles: section.titles,
            level: section.level,
            url: `/docs/${section.id}`,
            score
        };
    }).filter(result => result.score > 0 && result.id && result.title);

    // filter out results with score 0
    const filteredResults = results.filter(result => result.score > 0);

    // decrease score for duplicate titles (but keep the highest score)
    const titleCount: Record<string, {
        count: number;
        highestScore: number;
    }> = {};
    filteredResults.forEach(result => {
        titleCount[result.title] = {
            count: (titleCount[result.title]?.count || 0) + 1,
            highestScore: Math.max(titleCount[result.title]?.highestScore || 0, result.score)
        };
    });
    filteredResults.forEach(result => {
        if (titleCount[result.title].count > 1 && result.score < titleCount[result.title].highestScore) {
            result.score -= 5;
        }
    });

    // sort by score descending
    filteredResults.sort((a, b) => b.score - a.score);

    return filteredResults;
};

export const buildFolders = (results: SearchResult[]): SearchResultFolder[] => {
    const folders: SearchResultFolder[] = [];
    results.forEach(result => {
        let currentLevel = folders;
        result.titles.forEach((title, index) => {
            let folder = currentLevel.find(f => f.title === title || f.title.includes(title));
            if (!folder) {
                folder = {
                    id: `${result.id}-level-${index}`,
                    title,
                    url: index === result.titles.length - 1 ? result.url : '',
                    children: []
                };
                currentLevel.push(folder);
            }
            currentLevel = folder.children;
        });
    });

    // sort folders alphabetically
    const sortFolders = (folders: SearchResultFolder[]) => {
        folders.sort((a, b) => a.title.localeCompare(b.title));
        folders.forEach(folder => sortFolders(folder.children));
    };
    sortFolders(folders);

    return folders;
};

export const openLink = async (link: string, event: any): Promise<SearchResult | null> => {
    // remove '/docs/' from the link if it exists
    if (link.startsWith('/docs/')) {
        link = link.substring(6);
    } else if (link.startsWith('docs/')) {
        link = link.substring(5);
    }
    // add '/' to the start of the link if it doesn't exist
    if (!link.startsWith('/')) {
        link = '/' + link;
    }
    // remove '#' and anything after it
    if (link.includes('#')) {
        link = link.split('#')[0];
    }
    return await queryCollection(event, 'docs').path(link).first();
};