import { processSearchResults, buildFolders, type SearchResult, type SearchResultFolder, type SearchResultsResponse } from '../utils/search';

export default defineEventHandler(async (event): Promise<SearchResultsResponse> => {
  const query = getQuery(event).q as string;
  const page = parseInt((getQuery(event).page as string) || '1', 10);
  const pageSize = parseInt((getQuery(event).pageSize as string) || '10', 10);
  if (!query) {
    return { results: [], folders: [], total: 0, page, pageSize };
  }
  const sections = await queryCollectionSearchSections(event, 'docs');

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