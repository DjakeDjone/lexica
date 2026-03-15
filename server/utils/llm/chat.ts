import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import type { H3Event } from "h3";
import type { SearchResult } from "../search";
import { openLink } from "../search";
import { getRelevantSections } from "../llm-search";
import { systemPromptWithContext, systemPromptWithoutContext } from "./prompts";
import { createGroqClient, getResponseContent, sectionsToContext } from "./shared";

const contextualizeQuery = async (
    query: string,
    history: ChatCompletionMessageParam[],
): Promise<string> => {
    if (!history || history.length === 0) return query;

    const groq = createGroqClient();
    const relevantHistory = history.slice(-6);

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content:
                    `You are an AI assistant that rephrases user questions to be standalone based on the conversation history.
The user is asking a follow-up question that might refer to previous context (e.g., "What is it used for?", "How does that work?").
Your task is to rewrite the LAST user question so that it contains all necessary context from the history to be understood without the history.

Examples:
History: User: "What is HTTP?" Assistant: "HTTP is..." User: "Is it secure?"
Output: "Is HTTP secure?"

History: User: "Tell me about Nginx." Assistant: "Nginx is..." User: "How do I install it?"
Output: "How do I install Nginx?"

If the question is already standalone, output it exactly as is.
Do NOT answer the question. ONLY output the rephrased question.`,
            },
            ...relevantHistory,
            { role: "user", content: `Rephrase this question: "${query}"` },
        ],
        temperature: 0.1,
        max_tokens: 200,
    });

    const rephrasedQuery = getResponseContent(response, query).trim() || query;
    console.log(
        `[Contextualization] Original: "${query}" -> Rephrased: "${rephrasedQuery}"`,
    );
    return rephrasedQuery;
};

export const askLLM = async (
    prompt: string,
    history: ChatCompletionMessageParam[] = [],
    event: H3Event,
    contextLinks?: string[],
    withoutContext?: boolean,
    aiSettings: { model?: string; useTools?: boolean } = {},
) => {
    let context = "";
    let relevantSections: SearchResult[] = [];

    let searchPrompt = prompt;
    if (!withoutContext && !contextLinks && history.length > 0) {
        try {
            searchPrompt = await contextualizeQuery(prompt, history);
        } catch (error) {
            console.error("Failed to contextualize query:", error);
        }
    }

    if (!withoutContext) {
        if (!contextLinks) {
            relevantSections = await getRelevantSections(searchPrompt, event);
            context = sectionsToContext(relevantSections);
        } else {
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

    const promptWithContext = `
        Context:
        ${context}

        Question:
        ${prompt}
      `;

    const messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: withoutContext ? systemPromptWithoutContext : systemPromptWithContext,
        },
        ...history,
        {
            role: "user",
            content: withoutContext ? prompt : promptWithContext,
        },
    ];

    console.log("------------------------------------------------------------------");
    console.log("DEBUG: RAG Mode:", !withoutContext);
    console.log("DEBUG: Context Length:", context.length);
    console.log("DEBUG: Context Preview:", context.substring(0, 500));
    console.log("DEBUG: Messages sent to LLM:", JSON.stringify(messages, null, 2));
    console.log("------------------------------------------------------------------");

    const groq = createGroqClient();
    const response = await groq.chat.completions.create({
        model: aiSettings.model || "openai/gpt-oss-120b",
        messages,
        max_completion_tokens: 4096,
        temperature: 0.1,
        top_p: 1,
        stream: true,
    });

    return {
        response,
        relevantSections: relevantSections.map((section) => {
            const { content, ...rest } = section;
            return rest;
        }),
    };
};
