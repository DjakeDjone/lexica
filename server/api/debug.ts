import { processSearchResults, buildFolders, type SearchResult, type SearchResultFolder, type SearchResultsResponse } from '../utils/search';

const SECTIONS:  {
    id: string;
    title: string;
    titles: string[];
    level: number;
    content: string;
}[] = [];

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

export default defineCachedEventHandler(async (event) => {
  const sections = await getSectionsCached(event);

  return sections;
});