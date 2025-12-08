import Groq from "groq-sdk";
import { openLink, processSearchResults, SearchResult } from "./search";
import { getRelevantSections } from "./llm-search";

const groqApiKey = useRuntimeConfig().groqApiKey;

export const systemPromptWithTools = `You are Lexa, a helpful and professional AI assistant for the documentation website of Benjamin Friedl, a student at the HTL St. Pölten.

You have access to a search tool that allows you to search through the documentation. Use this tool whenever you need to find specific information to answer the user's question.

**CRITICAL INSTRUCTIONS:**
- Do NOT output <function=...> or similar constructs.
- Do NOT put JSON arguments in the tool name.
- I will provide you with relevant documentation sections as context.
- Base your answers EXCLUSIVELY on the provided context.
- NEVER invent information or answer from your general knowledge alone.
- If the context does not contain sufficient information, state that you could not find the information.
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
- **NEVER** use outside knowledge or answer from your general knowledge base. If the answer is not in the context, state: "I cannot answer this question based on the available documentation."
- **Language:** Always respond in the same language as the user's question.

**RESPONSE FORMAT:**
You must format your response using the following Markdown structure:

### Summary
Provide a concise summary that directly answers the user's question based ONLY on the context.

### Relevant Information
- Use bullet points to detail the key information from the documentation that supports the summary.
- You can use direct quotes from the text using the blockquote format.

### Sources
- You MUST list every source you used.
- Format: \`- [Title](URL)\`
- ONLY use the Title and URL provided in the context blocks.
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

const systemPromptForTestGeneration = `You are Lexa, an educational AI assistant.
Your task is to generate a test/quiz based EXCLUSIVELY on the provided documentation sections (context).

**INSTRUCTIONS:**
- Generate 3-5 multiple choice or short answer questions.
- Return the result as a strictly formatted JSON array of objects.
- Each object must have:
  - \`id\`: string (unique id)
  - \`question\`: string
  - \`type\`: "multiple_choice" | "short_answer"
  - \`options\`: string[] (only for multiple_choice)
  - \`correctAnswer\`: string (for internal validation)
- Do NOT output markdown formatting (like \`\`\`json), just the raw JSON string.
- The questions must be answerable from the context.
`;

const systemPromptForGrading = `You are Lexa, an educational AI assistant.
Your task is to grade a user's answers to a test based on the provided documentation sections (context) and the original questions.

**INSTRUCTIONS:**
- You will receive the Questions, the User's Answers, and the Context.
- For each answer, determine if it is correct based on the context.
- Return the result as a strictly formatted JSON array of objects.
- Each object must have:
  - \`questionId\`: string
  - \`correct\`: boolean
  - \`explanation\`: string (short explanation of why it is correct or incorrect, citing the context).
- Do NOT output markdown formatting, just the raw JSON string.
`;


export const generateTest = async (contextLinks: string[], event: any) => {
      let relevantSections: SearchResult[] = [];
      for (const link of contextLinks) {
            const section = await openLink(link, event);
            if (section) {
                  relevantSections.push(section);
            }
      }
      const context = sectionsToContext(relevantSections);

      const groq = new Groq({ apiKey: groqApiKey });
      const messages = [
            { role: "system", content: systemPromptForTestGeneration },
            { role: "user", content: `Context:\n${context}\n\nGenerate a test.` }
      ] as any[];

      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Use a capable model for JSON generation
            messages,
            response_format: { type: "json_object" },
            temperature: 0.1,
      });

      return {
            test: JSON.parse(response.choices[0].message.content || "[]"),
            relevantSections: relevantSections.map(s => ({ title: s.title, url: s.url }))
      };
};

export const gradeTest = async (questions: any[], answers: any[], contextLinks: string[], event: any) => {
       let relevantSections: SearchResult[] = [];
      for (const link of contextLinks) {
            const section = await openLink(link, event);
            if (section) {
                  relevantSections.push(section);
            }
      }
      const context = sectionsToContext(relevantSections);

      const groq = new Groq({ apiKey: groqApiKey });
      const messages = [
            { role: "system", content: systemPromptForGrading },
            { role: "user", content: `Context:\n${context}\n\nQuestions:\n${JSON.stringify(questions)}\n\nUser Answers:\n${JSON.stringify(answers)}\n\nGrade the test.` }
      ] as any[];

      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            response_format: { type: "json_object" },
            temperature: 0.1,
      });

      return JSON.parse(response.choices[0].message.content || "[]");
};



export const askLLM = async (prompt: string, history: { role: string; content: string }[] = [], event: any,
      contextLinks?: string[]
      , withoutContext?: boolean
      , aiSettings: { model?: string; useTools?: boolean } = {},

) => {
      // Use tool-based approach if enabled
      // Use tool-based approach if enabled
      /* if (aiSettings.useTools) {
             return await askLLMWithTools(prompt, history, event, aiSettings);
       } */

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
      
      console.log("------------------------------------------------------------------");
      console.log("DEBUG: RAG Mode:", !withoutContext);
      console.log("DEBUG: Context Length:", context.length);
      console.log("DEBUG: Context Preview:", context.substring(0, 500));
      console.log("DEBUG: Messages sent to LLM:", JSON.stringify(messages, null, 2));
      console.log("------------------------------------------------------------------");


      const response = await groq.chat.completions.create({
            model: aiSettings.model || "openai/gpt-oss-120b",
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

