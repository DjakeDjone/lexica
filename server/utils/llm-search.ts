import Groq from "groq-sdk";

const groqApiKey = useRuntimeConfig().groqApiKey;

export const getRelevantSections = async (query: string, event: any) => {
      const sections = await queryCollectionSearchSections(event, 'docs');

      const groq = new Groq({
            apiKey: groqApiKey,
      });


      // ai creates search queries
      const searches = await groq.chat.completions.create({
            model: "gemma2-9b-it",
            messages: [
                  {
                        role: "system",
                        content: `You are an AI assistant that helps to create search queries for a document search engine.
 Your task is to generate a list of search queries based on the user's question. The search queries should be relevant to the user's question and should help to find the most relevant documents.
 
 Here are some examples:
 User question: "What is the capital of France?"
 Answer: ["capital of France", "France capital", "French capital city"]
 
 User question: "How to bake a cake?"
 Search queries: ["bake a cake", "cake recipe", "how to make a cake"]

Always respond with a list of search queries in the following format:
      [ "search query 1", "search query 2", "search query 3"]
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
      for (const searchQuery of searchQueryList) {
            const filteredResults = processSearchResults(sections, searchQuery);
            results.push(...filteredResults);
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

      return slicedResults;
};