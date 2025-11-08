import { processSearchResults, buildFolders, type SearchResult, type SearchResultFolder, type SearchResultsResponse } from '../utils/search';

const SECTIONS:  {
    id: string;
    title: string;
    titles: string[];
    level: number;
    content: string;
}[] = [];

const getSectionsCached = (event: any) => {
  if (SECTIONS.length > 0) {
    return SECTIONS;
  }
  return queryCollectionSearchSections(event, 'docs').then(sections => {
    SECTIONS.push(...sections);
    return SECTIONS;
  });
};

export default defineCachedEventHandler(async (event): Promise<SearchResultsResponse> => {
  const query = getQuery(event).q as string;
  const page = parseInt((getQuery(event).page as string) || '1', 10);
  const pageSize = parseInt((getQuery(event).pageSize as string) || '10', 10);
  if (!query) {
    return { results: [], folders: [], total: 0, page, pageSize };
  }
  const sections = await getSectionsCached(event);

  const filteredResults = processSearchResults(sections, query);

  // paginate
  const paginatedResults = filteredResults.slice((page - 1) * pageSize, page * pageSize).map(result => {
    // remove content from result for search results
    const { content, ...rest } = result;
    return rest;
  });

  // folders
  // const folders = buildFolders(filteredResults);

  return {
    results: paginatedResults,
    total: filteredResults.length,
    folders: [],
    page,
    pageSize
  };
});