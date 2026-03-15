import Groq from "groq-sdk";
import type { SearchResult } from "../search";

const groqApiKey = useRuntimeConfig().groqApiKey;

export const createGroqClient = () => new Groq({ apiKey: groqApiKey });

export const getResponseContent = (
    response: { choices?: Array<{ message?: { content?: string | null } }> },
    fallback = "{}",
): string => response.choices?.[0]?.message?.content || fallback;

export const sectionsToContext = (sections: SearchResult[]): string => {
    return sections
        .map((section) => `Title: ${section.title}\nContent: ${section.content}\nURL: ${section.url}`)
        .join("\n\n");
};

export const stripMarkdownNoise = (markdown: string): string => {
    return markdown
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[>#*_`~-]/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 3).trim()}...`;
};
