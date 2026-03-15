export type SearchResult = {
    id: string;
    title: string;
    tag?: string;
    titles: string[];
    level: number;
    description: string;
    content?: string;
    contentRaw?: string;
    score: number;
    url: string;
};

export type Section = {
    id: string;
    title: string;
    titles: string[];
    level: number;
    content: string;
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

export const getContentFromRaw = (raw: string): string => {
    return raw; // Placeholder
};


export const extendSearchResults = (results: Section[]): SearchResult[] => {
    const extendedResults: SearchResult[] = results.map(section => ({
        id: section.id,
        title: section.title,
        titles: section.titles,
        level: section.level,
        description: section.content.length > 200 ? section.content.substring(0, 197) + '...' : section.content,
        content: section.content,
        contentRaw: section.content,
        score: 0,
        url: section.id,
    }));

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

type SectionSearchCache = {
    signature: string;
    normalizedTitles: string[];
    normalizedTitleText: string;
    normalizedContent: string;
    titleTokens: Set<string>;
    contentTokens: Set<string>;
};

const sectionCache = new Map<string, SectionSearchCache>();

const normalizeText = (text: string): string => text.toLowerCase();

const tokenize = (text: string): string[] => {
    const matches = text.match(/[\p{L}\p{N}_-]+/gu);
    if (!matches) return [];
    return matches.map(t => t.toLowerCase());
};

const getSectionCache = (section: SearchResult): SectionSearchCache => {
    const sectionId = section.id || `${section.title}-${section.level}`;
    const signature = `${section.title}|${section.titles.join('|')}|${section.content?.length || 0}`;
    const existing = sectionCache.get(sectionId);

    if (existing && existing.signature === signature) {
        return existing;
    }

    const normalizedTitles = section.titles.map(normalizeText);
    const normalizedTitleText = normalizedTitles.join(' ');
    const normalizedContent = normalizeText(section.content || '');

    const cacheEntry: SectionSearchCache = {
        signature,
        normalizedTitles,
        normalizedTitleText,
        normalizedContent,
        titleTokens: new Set(tokenize(normalizedTitleText)),
        contentTokens: new Set(tokenize(normalizedContent))
    };

    sectionCache.set(sectionId, cacheEntry);
    return cacheEntry;
};

export const clearSearchSectionCache = (): void => {
    sectionCache.clear();
};

export const scoreSection = (section: SearchResult, query: string): number => {
    const normalizedQuery = normalizeText(query.trim());
    if (!normalizedQuery) return 0;

    const words = tokenize(normalizedQuery);
    if (words.length === 0) return 0;

    const sectionData = getSectionCache(section);
    let score = 0;
    let hasAnyMatch = false;

    words.forEach(word => {
        let wordScore = 0;
        let foundMatch = false;

        // Fast exact token match in titles
        if (sectionData.titleTokens.has(word)) {
            wordScore += 20; // High boost for exact word match in title
            foundMatch = true;
        } else {
            // Substring match in titles
            const partialTitleMatch = sectionData.normalizedTitles.some(title => title.includes(word));
            if (partialTitleMatch) {
                wordScore += 8;
                foundMatch = true;
            }
        }

        // Content fallback after title checks
        if (!foundMatch && sectionData.normalizedContent) {
            if (sectionData.contentTokens.has(word)) {
                wordScore += 10; // Good boost for exact word match in content
                foundMatch = true;
            } else if (sectionData.normalizedContent.includes(word)) {
                wordScore += 4;
                foundMatch = true;
            }
        }

        if (foundMatch) {
            hasAnyMatch = true;
        }

        score += wordScore;
    });

    if (sectionData.normalizedTitleText.includes(normalizedQuery)) {
        score += 10;
        hasAnyMatch = true;
    } else if (sectionData.normalizedContent.includes(normalizedQuery)) {
        score += 4;
        hasAnyMatch = true;
    }

    // reward stable path-like IDs
    if (section.id && !section.id.includes(' ')) {
        score += 2;
    }

    // Only filter out if no matches found at all
    if (!hasAnyMatch || score < 1) {
        return 0;
    }

    // Boost score for matches in higher-level sections
    score += Math.max(0, 10 - section.level * 3); // Higher level (lower number) gets more points

    return score;
};

export const processSearchResults = (sections: Section[], query: string): SearchResult[] => {
    const extendedSections = extendSearchResults(sections);
    const results: SearchResult[] = extendedSections.map((section) => {
        const score = scoreSection(section, query);
        let description = '';
        if (section.content) {
            description = section.content.length > 200 ? section.content.substring(0, 197) + '...' : section.content;
        }
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

import type { H3Event } from "h3";

export const openLink = async (link: string, event: H3Event): Promise<SearchResult | null> => {
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

    // check if it is an extra page
    const extraPage = extraPages.find(p => p.url === link);
    if (extraPage) {
        return {
            ...extraPage,
            id: extraPage.id,
            score: 1,
            titles: extraPage.titles,
            content: extraPage.content,
            contentRaw: extraPage.content,
            url: extraPage.url,
            level: extraPage.level,
            description: extraPage.description
        };
    }

    const result = await queryCollection(event, 'docs').path(link).first();
    
    if (!result) return null;

    // Map result to SearchResult, ensuring content is present
    // Nuxt Content usually puts content in 'body' as AST, but we might need a string representation
    // If 'content' field is missing, we need to handle it.
    // Assuming 'content' or 'description' might be available or we need to fallback.
    
    return {
        id: result._path || result.id || link, // Use _path if available
        title: result.title || 'Untitled',
        titles: [result.title || 'Untitled'],
        level: 1,
        content: result.rawbody || result.content || result.description || '', // Use rawbody for markdown content
        contentRaw: result.rawbody || result.content || result.description || '',
        score: 1,
        url: result.path || result._path || link, // Use path from result
        description: result.description || ''
    };
};