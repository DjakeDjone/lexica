import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import type { H3Event } from "h3";
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
- Return the result as a strictly formatted JSON object with a "questions" key.
- The object must follow this structure:
  {
      "questions": [
          {
              "id": "unique_string",
              "question": "string",
              "type": "multiple_choice" | "short_answer",
              "options": ["string"] (only for multiple_choice),
              "correctAnswer": "string"
          }
      ]
  }
- Do NOT output markdown formatting (like \`\`\`json), just the raw JSON string.
- The questions must be answerable from the context.
`;

const systemPromptForGrading = `You are Lexa, an educational AI assistant.
Your task is to grade a user's answers to a test based on the provided documentation sections (context) and the original questions.

**INSTRUCTIONS:**
- You will receive the Questions, the User's Answers, and the Context.
- For each answer, determine if it is correct based on the context.
- Return the result as a strictly formatted JSON object with a "grading" key.
- The object must follow this structure:
  {
      "grading": [
          {
              "questionId": "string",
              "correct": boolean,
              "explanation": "string"
          }
      ]
  }
- Do NOT output markdown formatting, just the raw JSON string.
`;

interface TestQuestion {
    id: string;
    question: string;
    type: "multiple_choice" | "short_answer";
    options?: string[];
    correctAnswer: string;
}

interface TestGrading {
    questionId: string;
    correct: boolean;
    explanation: string;
}

interface TestAnswer {
    questionId: string;
    answer: string;
}


export const generateTest = async (contextLinks: string[], event: H3Event) => {
      let relevantSections: SearchResult[] = [];
      for (const link of contextLinks) {
            const section = await openLink(link, event);
            if (section) {
                  relevantSections.push(section);
            }
      }
      const context = sectionsToContext(relevantSections);

      const groq = new Groq({ apiKey: groqApiKey });
      const messages: ChatCompletionMessageParam[] = [
            { role: "system", content: systemPromptForTestGeneration },
            { role: "user", content: `Context:\n${context}\n\nGenerate a test.` }
      ];

      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Use a capable model for JSON generation
            messages,
            response_format: { type: "json_object" },
            temperature: 0.1,
      });

      const parsedContent = JSON.parse(response.choices[0].message.content || "{}");
      return {
            test: (parsedContent.questions || []) as TestQuestion[],
            relevantSections: relevantSections.map(s => ({ title: s.title, url: s.url }))
      };
};

export const gradeTest = async (questions: TestQuestion[], answers: TestAnswer[], contextLinks: string[], event: H3Event) => {
       let relevantSections: SearchResult[] = [];
      for (const link of contextLinks) {
            const section = await openLink(link, event);
            if (section) {
                  relevantSections.push(section);
            }
      }
      const context = sectionsToContext(relevantSections);

      const groq = new Groq({ apiKey: groqApiKey });
      const messages: ChatCompletionMessageParam[] = [
            { role: "system", content: systemPromptForGrading },
            { role: "user", content: `Context:\n${context}\n\nQuestions:\n${JSON.stringify(questions)}\n\nUser Answers:\n${JSON.stringify(answers)}\n\nGrade the test.` }
      ];

      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            response_format: { type: "json_object" },
            temperature: 0.1,
      });

      const parsedContent = JSON.parse(response.choices[0].message.content || "{}");
      return (parsedContent.grading || []) as TestGrading[];
};




const contextualizeQuery = async (query: string, history: ChatCompletionMessageParam[]) => {
      if (!history || history.length === 0) return query;

      const groq = new Groq({ apiKey: groqApiKey });
      
      // Keep only the last few messages to avoid token limits and keep it relevant
      const relevantHistory = history.slice(-6); 

      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                  {
                        role: "system",
                        content: `You are an AI assistant that rephrases user questions to be standalone based on the conversation history.
      The user is asking a follow-up question that might refer to previous context (e.g., "What is it used for?", "How does that work?").
      Your task is to rewrite the LAST user question so that it contains all necessary context from the history to be understood without the history.
      
      Examples:
      History: User: "What is HTTP?" Assistant: "HTTP is..." User: "Is it secure?"
      Output: "Is HTTP secure?"
      
      History: User: "Tell me about Nginx." Assistant: "Nginx is..." User: "How do I install it?"
      Output: "How do I install Nginx?"
      
      If the question is already standalone, output it exactly as is.
      Do NOT answer the question. ONLY output the rephrased question.
      `
                  },
                  ...relevantHistory,
                  { role: "user", content: `Rephrase this question: "${query}"` }
            ],
            temperature: 0.1,
            max_tokens: 200,
      });

      const rephrasedQuery = response.choices[0].message.content?.trim() || query;
      console.log(`[Contextualization] Original: "${query}" -> Rephrased: "${rephrasedQuery}"`);
      return rephrasedQuery;
}

export const askLLM = async (prompt: string, history: ChatCompletionMessageParam[] = [], event: H3Event,
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
      
      // Contextualize the query using history if we are going to search for context
      let searchPrompt = prompt;
      if (!withoutContext && !contextLinks && history.length > 0) {
            try {
                  searchPrompt = await contextualizeQuery(prompt, history);
            } catch (e) {
                  console.error("Failed to contextualize query:", e);
                  // Fallback to original prompt
            }
      }

      if (!withoutContext) {
            if (!contextLinks) {
                  // Use the contextualized prompt for search
                  relevantSections = await getRelevantSections(searchPrompt, event);
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

      const messages: ChatCompletionMessageParam[] = [
            { role: "system", content: withoutContext ? systemPromptWithoutContext : systemPromptWithContext },
            ...history,
            { role: "user", content: withoutContext ? prompt : promptWithContext },
      ];
      
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

