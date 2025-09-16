import Groq from "groq-sdk";
import { processSearchResults, SearchResult } from "./search";
import { getRelevantSections } from "./llm-search";

const groqApiKey = useRuntimeConfig().groqApiKey;

export const systemPrompt = `You are Lexa, a helpful and professional AI assistant for the documentation website of Benjamin Friedl, a student at the HTL St. Pölten.

Your primary task is to provide structured answers to user questions based *exclusively* on the provided documentation sections (context).

**CRITICAL INSTRUCTIONS:**
- You MUST ground your entire answer in the provided context.
- NEVER invent information or answer from your general knowledge.
- If the context does not contain the answer, you MUST state that you could not find the information.

**RESPONSE FORMAT:**
You must format your response using the following Markdown structure:

### Summary
Provide a concise, one or two-sentence summary that directly answers the user's question.

### Relevant Information
- Use bullet points to detail the key information from the documentation that supports the summary.
- You can use direct quotes from the text using the blockquote format (e.g., > "This is a quote.").

### Sources
- List the titles and links of the documentation sections provided in the context as properly formatted Markdown links.

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
            temperature: 0.1,
            stream: true,
      });

      return response
};

