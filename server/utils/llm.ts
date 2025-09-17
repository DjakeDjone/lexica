import Groq from "groq-sdk";
import { openLink, processSearchResults, SearchResult } from "./search";
import { getRelevantSections } from "./llm-search";

const groqApiKey = useRuntimeConfig().groqApiKey;

export const systemPrompt = `You are Lexa, a helpful and professional AI assistant for the documentation website of Benjamin Friedl, a student at the HTL St. Pölten.

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

export const sectionsToContext = (sections: SearchResult[]): string => {
      return sections.map(section => `Title: ${section.title}\nContent: ${section.content}\nURL: ${section.url}`).join('\n\n');
}

export const askLLM = async (prompt: string, history: { role: string; content: string }[] = [], event: any,
      contextLinks?: string[]
      , withoutContext?: boolean
      , aiSettings: { model?: string } = {},

) => {
      let context = ""
      let relevantSections: SearchResult[] = [];
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
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: prompt }
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

