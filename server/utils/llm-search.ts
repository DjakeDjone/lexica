import Groq from "groq-sdk";
import { openLink, processSearchResults, SearchResult } from "./search";
import { searchVectors } from "./vector-search";

const groqApiKey = useRuntimeConfig().groqApiKey;

export const getRelevantSections = async (query: string, event: any): Promise<SearchResult[]> => {
      const sections = await queryCollectionSearchSections(event, 'docs');

      const groq = new Groq({
            apiKey: groqApiKey,
      });


      // ai creates search queries
      const searches = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                  {
                        role: "system",
                        content: `You are an AI assistant that helps to create search queries for a document search engine.
 Your task is to generate a list of search queries based on the user's question. The search queries are executed in a fuzzy search engine, so they can be short and concise.
The search queries should be in english and german.
      The search queries should be relevant to the user's question and should help to find the most relevant documents.
      Provide the search queries in a list format, enclosed in square brackets and double quotes, separated by commas.
      The search queries should be short, ideally 2-5 words long.
      Sort them by relevance, with the most relevant ones first.

      Example:
      User question: "Was ist tcp?"
      Search queries: ["tcp", "tcp protocol", "tcp/ip", "transmission control protocol"]
      
      User question: "How to center a div in css?"
      Search queries: ["center div css", "css center div", "css center element", "css center block element"]
 `,
                  },
                  {
                        role: "user",
                        content: `User question: "${query}"`
                  },
            ],
            max_tokens: 200,
            // temperature very low to get consistent results
            temperature: 0,
      });
      const searchQueries = searches.choices[0].message?.content;
      console.log("Generated search queries:", searchQueries);

      // extract search queries from ai response
      const searchQueryList = searchQueries?.match(/\[(.*?)\]/)?.[1].split(',').map(s => s.trim().replace(/(^"|"$)/g, '')) || [];

      console.log("Extracted search queries:", searchQueryList);

      // find relevant sections based on search queries
      const results: SearchResult[] = [];
      for (const [i, searchQuery] of searchQueryList.entries()) {
            const filteredResults = processSearchResults(sections, searchQuery);
            filteredResults.forEach(r => r.score += (3 - i));
            results.push(...filteredResults);
            results.push(...filteredResults);
      }

      // Add vector search results
      try {
            console.log("Executing vector search...");
            const vectorResults = await searchVectors(query, sections);
            console.log(`Found ${vectorResults.length} vector results`);
            
            // Normalize scores to match keyword search magnitude (roughly 0-100+)
            // Vector scores are 0-1. Let's multiply by 50 to give them weight but not override exact matches
            vectorResults.forEach(r => r.score = r.score * 50);
            
            results.push(...vectorResults.slice(0, 10));
      } catch (e) {
            console.error("Vector search failed:", e);
      }

      // deduplicate results
      const uniqueResults = Array.from(new Set(results.map(r => r.id))).map(id => {
            return results.find(r => r.id === id);
      }).filter((r): r is SearchResult => r !== undefined);
      console.log("Unique results:", uniqueResults);

      uniqueResults.sort((a, b) => b.score - a.score);
      const slicedResults = uniqueResults.slice(0, 10);
      // fix links
      slicedResults.forEach(r => {
            // remove '/docs' from the start of the url
            r.url = r.url.replace('/docs', '');
            // remove multiple slashes
            r.url = r.url.replace(/\/+/g, '/');
            // add base url
            r.url = (useRuntimeConfig().baseUrl || 'http://localhost:3000') + r.url;

      });
      console.log("Final relevant sections:", slicedResults);
      // remove results with 

      return slicedResults;
};