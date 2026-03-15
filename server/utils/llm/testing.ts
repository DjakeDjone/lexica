import type { H3Event } from "h3";
import type { SearchResult } from "../search";
import { openLink } from "../search";
import { createGroqClient, getResponseContent, sectionsToContext } from "./shared";
import { systemPromptForGrading, systemPromptForTestGeneration } from "./prompts";
import type { TestAnswer, TestGrading, TestQuestion } from "./types";

export const generateTest = async (contextLinks: string[], event: H3Event) => {
    const relevantSections: SearchResult[] = [];
    for (const link of contextLinks) {
        const section = await openLink(link, event);
        if (section) {
            relevantSections.push(section);
        }
    }

    const context = sectionsToContext(relevantSections);
    const groq = createGroqClient();
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPromptForTestGeneration },
            { role: "user", content: `Context:\n${context}\n\nGenerate a test.` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
    });

    const parsedContent = JSON.parse(getResponseContent(response));
    return {
        test: (parsedContent.questions || []) as TestQuestion[],
        relevantSections: relevantSections.map((section) => ({
            title: section.title,
            url: section.url,
        })),
    };
};

export const gradeTest = async (
    questions: TestQuestion[],
    answers: TestAnswer[],
    contextLinks: string[],
    event: H3Event,
): Promise<TestGrading[]> => {
    const relevantSections: SearchResult[] = [];
    for (const link of contextLinks) {
        const section = await openLink(link, event);
        if (section) {
            relevantSections.push(section);
        }
    }

    const context = sectionsToContext(relevantSections);
    const groq = createGroqClient();
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPromptForGrading },
            {
                role: "user",
                content: `Context:\n${context}\n\nQuestions:\n${JSON.stringify(
                    questions,
                )}\n\nUser Answers:\n${JSON.stringify(answers)}\n\nGrade the test.`,
            },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
    });

    const parsedContent = JSON.parse(getResponseContent(response));
    return (parsedContent.grading || []) as TestGrading[];
};
