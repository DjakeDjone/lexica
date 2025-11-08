import { processSearchResults, buildFolders, type SearchResult, type SearchResultFolder, type SearchResultsResponse, Section } from '../utils/search';

const SECTIONS: Section[] = [];

const getSectionsCached = (event: any, rebuild: boolean = false) => {
  if (SECTIONS.length > 0 && !rebuild) {
    return SECTIONS;
  }

  console.time('Rebuild search index time');
  console.log("Current length of SECTIONS:", SECTIONS.length);
  SECTIONS.length = 0;
  return queryCollectionSearchSections(event, 'docs').then(sections => {
    SECTIONS.push(...sections);
    return SECTIONS;
  });
};

export default defineCachedEventHandler(async (event): Promise<SearchResultsResponse> => {
  const query = getQuery(event).q as string;
  const page = parseInt((getQuery(event).page as string) || '1', 10);
  const pageSize = parseInt((getQuery(event).pageSize as string) || '10', 10);
  const rebuildCache = getQuery(event).rebuildCache === 'true';

  if (!query) {
    return { results: [], folders: [], total: 0, page, pageSize };
  }
  const sections = await getSectionsCached(event, rebuildCache);

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