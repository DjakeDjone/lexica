import Groq from "groq-sdk";
import { processSearchResults, SearchResult } from "./search";

const groqApiKey = useRuntimeConfig().groqApiKey;

export const systemPrompt = `You are Lexa, an AI assistant for a website that hosts all docs of Benjamin Friedl, a student at the HTL St. Pölten.
 Your task is to help users find relevant documentation based on their queries. Use the provided sections from the documentation to answer questions and provide links to the relevant sections.

`;

export const askLLM = async (prompt: string, history: { role: string; content: string }[] = [], event: any) => {
      const relevantSections = await getRelevantSections(prompt, event);
      const context = relevantSections.map(section => `Title: ${section.title}\nContent: ${section.description}\nURL: ${section.url}`).join('\n\n');

      const groq = new Groq({
            apiKey: groqApiKey,
      });

      const messages = [
            { role: "system", content: systemPrompt + (context ? `Here are some relevant sections from the documentation:\n\n${context}\n\nUse these sections to answer the user's question. If you can't find an answer, respond with "I'm sorry, I don't have enough information to answer that question."` : "Unfortunately, I couldn't find any relevant sections in the documentation. Please try rephrasing your question or ask something else.") },
            ...history,
            { role: "user", content: prompt }
      ] as { role: 'user' | 'system' | 'assistant'; content: string }[];
      console.log("Messages sent to LLM:", messages);

      const response = await groq.chat.completions.create({
            model: "gemma2-9b-it",
            messages,
            max_tokens: 500,
            temperature: 0.9,
            stream: true,
      });

      return response
};

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
            temperature: 0.1,
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
      return uniqueResults.slice(0, 10);
};