import Fuse from "fuse.js";

export type SearchResult = {
    id: string;
    title: string;
    tag?: string;
    titles: string[];
    level: number;
    description: string;
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

export const scoreSection = (section: any, query: string): number => {
    const words = query.split(/\s+/).filter(w => w.length > 0);
    const wordScores = words.map(word => {
        const fuse = new Fuse([section], {
            keys: ['titles', 'content'],
            includeScore: true,
            threshold: 0.3
        });
        const result = fuse.search(word);
        if (result.length === 0) {
            return 0;
        }
        return Math.max(0, 10 - (result[0].score || 0) * 10);
    });
    let score = wordScores.reduce((a, b) => a + b, 0);

    // Boost score for title matches
    const titleMatch = words.some(word =>
        section.titles.some((title: string) =>
            title.toLowerCase().includes(word.toLowerCase())
        )
    );
    if (titleMatch) {
        score += 5;
    }

    // Boost score for matches in higher-level sections
    score += Math.max(0, 10 - section.level * 3); // Higher level (lower number) gets more points

    return score;
};

export const processSearchResults = (sections: any[], query: string): SearchResult[] => {
    const results: SearchResult[] = sections.map((section) => {
        const score = scoreSection(section, query);
        const description = section.content.length > 200 ? section.content.substring(0, 197) + '...' : section.content;

        return {
            id: section.id,
            title: section.titles[section.titles.length - 1],
            tag: section.titles.length > 1 ? section.titles[section.titles.length - 2] : undefined,
            description,
            titles: section.titles,
            level: section.level,
            url: `/docs/${section.id}`,
            score
        };
    });

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
