import Fuse from "fuse.js";

type SearchResult = {
  id: string;
  title: string;
  tag?: string;
  titles: string[];
  level: number;
  description: string;
  score: number;
  url: string;
};

type SearchResultFolder = {
  id: string;
  title: string;
  url: string;
  children: SearchResultFolder[];
};

type SearchResultsResponse = {
  results: SearchResult[];
  folders: SearchResultFolder[];
  total: number;
  page: number;
  pageSize: number;
};

const scoreSection = (section: any, query: string): number => {
  const fuse = new Fuse([section], {
    keys: ['titles', 'content'],
    includeScore: true,
    threshold: 0.3
  });
  const result = fuse.search(query);
  if (result.length === 0) {
    return 0;
  }
  let score = Math.max(0, 10 - (result[0].score || 0) * 10); // Scale score to 0-10

  // Boost score for title matches
  const titleMatch = section.titles.some((title: string) =>
    title.toLowerCase().includes(query.toLowerCase())
  );
  if (titleMatch) {
    score += 5;
  }

  // Boost score for matches in higher-level sections
  score += Math.max(0, 10 - section.level * 3); // Higher level (lower number) gets more points

  return score;
};

export default defineEventHandler(async (event): Promise<SearchResultsResponse> => {
  const query = getQuery(event).q as string;
  const page = parseInt((getQuery(event).page as string) || '1', 10);
  const pageSize = parseInt((getQuery(event).pageSize as string) || '10', 10);
  if (!query) {
    return { results: [], folders: [], total: 0, page, pageSize };
  }
  const sections = await queryCollectionSearchSections(event, 'docs');

  // value the results
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
  // paginate
  const paginatedResults = filteredResults.slice((page - 1) * pageSize, page * pageSize);


  // folders
  const folders: SearchResultFolder[] = [];
  filteredResults.forEach(result => {
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

  return {
    results: paginatedResults,
    total: filteredResults.length,
    folders,
    page,
    pageSize
  };
});