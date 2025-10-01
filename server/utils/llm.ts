import Groq from "groq-sdk";
import { openLink, processSearchResults, SearchResult } from "./search";
import { getRelevantSections } from "./llm-search";

const groqApiKey = useRuntimeConfig().groqApiKey;

export const systemPromptWithTools = `You are Lexa, a helpful and professional AI assistant for the documentation website of Benjamin Friedl, a student at the HTL St. Pölten.

You have access to a search tool that allows you to search through the documentation. Use this tool whenever you need to find specific information to answer the user's question.

**CRITICAL INSTRUCTIONS:**
- You MUST use the search_documentation tool to find relevant information before answering.
- You can call the search tool multiple times with different queries to gather comprehensive information.
- Base your answers EXCLUSIVELY on the information retrieved from searches.
- NEVER invent information or answer from your general knowledge alone.
- If the search results do not contain sufficient information, state that you could not find the information.
- **Language:** Always respond in the same language as the user's question.

**SEARCH STRATEGY:**
- Start with broad searches, then narrow down with specific queries if needed.
- Use different search terms if initial results are insufficient.
- Search in both English and German if relevant.

**RESPONSE FORMAT:**
You must format your response using the following Markdown structure:

### Summary
Provide a concise, one or two-sentence summary that directly answers the user's question.

### Relevant Information
- Use bullet points to detail the key information from the documentation that supports the summary.
- You can use direct quotes from the text using the blockquote format (e.g., > "This is a quote." (<source>)).

### Sources
- List the titles and URLs of the documentation sections you found as properly formatted Markdown links.
`;

export const systemPromptWithContext = `You are Lexa, a helpful and professional AI assistant for the documentation website of Benjamin Friedl, a student at the HTL St. Pölten.

Your primary task is to provide structured answers to user questions based *exclusively* on the provided documentation sections (context).

**CRITICAL INSTRUCTIONS:**
- You MUST ground your entire answer in the provided context.
- NEVER invent information or answer from your general knowledge.
- If the context does not contain the answer, you MUST state that you could not find the information.
- **Language:** Always respond in the same language as the user's question.

**RESPONSE FORMAT:**
You must format your response using the following Markdown structure:

### Summary
Provide a concise, one or two-sentence summary that directly answers the user's question.

### Relevant Information
- Use bullet points to detail the key information from the documentation that supports the summary.
- You can use direct quotes from the text using the blockquote format (e.g., > "This is a quote." (<source>)).

### Sources
- List the titles and links of the documentation sections provided in the context as properly formatted Markdown links.
`;

const systemPromptWithoutContext = `
You are Zenia, a helpful and professional AI assistant for the documentation website of Benjamin Friedl, a student at the HTL St. Pölten.

**CRITICAL INSTRUCTIONS:**
- You MUST NOT answer questions that cannot be answered with your general knowledge.
- If you do not know the answer, you MUST state that you do not know.
- NEVER invent information or make up answers.

**LANGUAGE:** Always respond in the same language as the user's question.

answer short and concisely.
`;

export const sectionsToContext = (sections: SearchResult[]): string => {
      return sections.map(section => `Title: ${section.title}\nContent: ${section.content}\nURL: ${section.url}`).join('\n\n');
}

const searchTool = {
      type: "function" as const,
      function: {
            name: "search_documentation",
            description: "Search through Benjamin's documentation to find relevant information. Returns the most relevant documentation sections based on the search query. Use this tool whenever you need to find specific information to answer the user's question.",
            parameters: {
                  type: "object",
                  properties: {
                        query: {
                              type: "string",
                              description: "The search query to find relevant documentation. Can be in English or German. Should be 2-5 words describing what you're looking for."
                        }
                  },
                  required: ["query"]
            }
      }
};

const tools = [searchTool];

const executeSearchTool = async (query: string, event: any): Promise<SearchResult[]> => {
      console.log(`[Tool] Executing search with query: "${query}"`);
      const sections = await queryCollectionSearchSections(event, 'docs');
      const results = processSearchResults(sections, query);
      const topResults = results.slice(0, 5);
      
      // Fix URLs
      topResults.forEach(r => {
            r.url = r.url.replace('/docs', '').replace(/\/+/g, '/');
      });
      
      console.log(`[Tool] Found ${topResults.length} results for query: "${query}"`);
      return topResults;
};

export const askLLMWithTools = async (
      prompt: string,
      history: { role: string; content: string }[] = [],
      event: any,
      aiSettings: { model?: string; useTools?: boolean } = {}
) => {
      const groq = new Groq({
            apiKey: groqApiKey,
      });

      const messages = [
            { role: "system", content: systemPromptWithTools },
            ...history,
            { role: "user", content: prompt },
      ] as any[];

      let allRelevantSections: SearchResult[] = [];
      let finalResponse: any;
      const maxIterations = 5; // Prevent infinite loops
      let iteration = 0;

      while (iteration < maxIterations) {
            iteration++;
            console.log(`[LLM] Iteration ${iteration}`);

            // Check if we should expect tool calls or final response
            const shouldStream = iteration > 1 && messages[messages.length - 1].role === "tool";
            
            if (shouldStream) {
                  // Stream the final response after tool execution
                  console.log("[LLM] Streaming final response after tool execution");
                  const streamResponse = await groq.chat.completions.create({
                        model: aiSettings.model || "llama-3.3-70b-versatile",
                        messages,
                        max_completion_tokens: 4096,
                        temperature: 0.1,
                        top_p: 1,
                        stream: true,
                  });
                  finalResponse = streamResponse;
                  break;
            }

            // Non-streaming call to check for tool usage
            const response = await groq.chat.completions.create({
                  model: aiSettings.model || "llama-3.3-70b-versatile",
                  messages,
                  tools,
                  tool_choice: "auto",
                  max_completion_tokens: 4096,
                  temperature: 0.1,
                  top_p: 1,
                  stream: false,
            });

            // Handle non-streaming response (check for tool calls)
            const message = response.choices[0].message;
            messages.push(message);

            // Check if the model wants to use tools
            if (message.tool_calls && message.tool_calls.length > 0) {
                  console.log(`[LLM] Model requested ${message.tool_calls.length} tool call(s)`);
                  
                  // Execute each tool call
                  for (const toolCall of message.tool_calls) {
                        if (toolCall.function.name === "search_documentation") {
                              const args = JSON.parse(toolCall.function.arguments);
                              const searchResults = await executeSearchTool(args.query, event);
                              allRelevantSections.push(...searchResults);

                              // Add tool response to messages
                              const toolResponse = {
                                    role: "tool",
                                    tool_call_id: toolCall.id,
                                    name: "search_documentation",
                                    content: JSON.stringify(searchResults.map(r => ({
                                          title: r.title,
                                          content: r.content,
                                          url: r.url,
                                          description: r.description
                                    })))
                              };
                              messages.push(toolResponse);
                        }
                  }
                  // Continue loop to get final response with tool results
            } else {
                  // Model provided answer without using tools (shouldn't happen if prompt is good)
                  console.log("[LLM] Model provided response without tool use");
                  // Make one more streaming call to get the answer
                  const streamResponse = await groq.chat.completions.create({
                        model: aiSettings.model || "llama-3.3-70b-versatile",
                        messages,
                        max_completion_tokens: 4096,
                        temperature: 0.1,
                        top_p: 1,
                        stream: true,
                  });
                  finalResponse = streamResponse;
                  break;
            }
      }

      if (!finalResponse) {
            console.error("[LLM] Max iterations reached without final response");
            throw new Error("Max iterations reached");
      }

      // Deduplicate sections
      const uniqueSections = Array.from(
            new Map(allRelevantSections.map(s => [s.id, s])).values()
      );

      return {
            response: finalResponse,
            relevantSections: uniqueSections.map(section => {
                  const { content, ...rest } = section;
                  return rest;
            })
      };
};

export const askLLM = async (prompt: string, history: { role: string; content: string }[] = [], event: any,
      contextLinks?: string[]
      , withoutContext?: boolean
      , aiSettings: { model?: string; useTools?: boolean } = {},

) => {
      // Use tool-based approach if enabled
      if (aiSettings.useTools) {
            return await askLLMWithTools(prompt, history, event, aiSettings);
      }

      // Legacy approach with pre-fetched context
      let context = ""
      let relevantSections: SearchResult[] = [];
      if (!withoutContext) {
            if (!contextLinks) {
                  relevantSections = await getRelevantSections(prompt, event);
                  context = sectionsToContext(relevantSections);
            } else {
                  relevantSections = [];
                  for (const link of contextLinks) {
                        const section = await openLink(link, event);
                        if (section) {
                              relevantSections.push(section);
                        } else {
                              console.warn(`Could not fetch section for link: ${link}, ${section}`);
                        }
                  }
                  console.log("Fetched sections for provided links:", relevantSections);
                  console.log("withoutContext:", contextLinks);
                  context = sectionsToContext(relevantSections);
            }
      }

      console.log("Using context:", context);

      const groq = new Groq({
            apiKey: groqApiKey,
      });

      const promptWithContext = `
        Context:
        ${context}
        
        Question:
        ${prompt}
      `;

      const messages = [
            { role: "system", content: withoutContext ? systemPromptWithoutContext : systemPromptWithContext },
            ...history,
            { role: "user", content: withoutContext ? prompt : promptWithContext },
      ] as { role: 'user' | 'system' | 'assistant'; content: string }[];
      console.log("Messages sent to LLM:", messages);

      const response = await groq.chat.completions.create({
            model: aiSettings.model || "qwen/qwen3-32b",
            messages,
            max_completion_tokens: 4096,
            temperature: 0.1,
            top_p: 1,
            // reasoning_format: 'hidden',
            // reasoning_effort: '',
            stream: true,
      });

      return {
            response,
            relevantSections: relevantSections.map(section => {
                  const { content, ...rest } = section; // remove content for smaller payload
                  return rest;
            })
      }
};

