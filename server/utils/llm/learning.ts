import type { H3Event } from "h3";
import { openLink } from "../search";
import { createGroqClient, getResponseContent, stripMarkdownNoise, truncateText } from "./shared";
import {
    systemPromptForGrading,
    systemPromptForLearningSessionSummary,
    systemPromptForLearnPlan,
    systemPromptForLearnQuiz,
} from "./prompts";
import type {
    LearnPlan,
    LearnSectionCandidate,
    LearningSessionResult,
    TestAnswer,
    TestGrading,
    TestQuestion,
} from "./types";
import { DEFAULT_LLM_MODEL } from "./config";

const createParagraphChunks = (
    text: string,
    sourceTitle: string,
    url: string,
): LearnSectionCandidate[] => {
    const paragraphs = text
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    const chunks: LearnSectionCandidate[] = [];
    let currentChunk = "";
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
        const nextChunk = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;
        if (nextChunk.length > 1200 && currentChunk) {
            chunkIndex += 1;
            chunks.push({
                id: `${url}::chunk-${chunkIndex}`,
                title: chunkIndex === 1
                    ? `${sourceTitle} Overview`
                    : `${sourceTitle} Part ${chunkIndex}`,
                sourceTitle,
                content: currentChunk.trim(),
                url,
            });
            currentChunk = paragraph;
        } else {
            currentChunk = nextChunk;
        }
    }

    if (currentChunk.trim()) {
        chunkIndex += 1;
        chunks.push({
            id: `${url}::chunk-${chunkIndex}`,
            title: chunkIndex === 1
                ? `${sourceTitle} Overview`
                : `${sourceTitle} Part ${chunkIndex}`,
            sourceTitle,
            content: currentChunk.trim(),
            url,
        });
    }

    return chunks;
};

const splitMarkdownIntoLearnSections = (
    sourceTitle: string,
    markdown: string,
    url: string,
): LearnSectionCandidate[] => {
    const lines = markdown.split("\n");
    const sections: LearnSectionCandidate[] = [];
    let currentTitle = `${sourceTitle} Overview`;
    let currentLines: string[] = [];
    let sectionIndex = 0;

    const pushSection = () => {
        const content = currentLines.join("\n").trim();
        if (!content) return;
        sectionIndex += 1;
        sections.push({
            id: `${url}::section-${sectionIndex}`,
            title: currentTitle,
            sourceTitle,
            content,
            url,
        });
    };

    for (const line of lines) {
        const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
        if (headingMatch) {
            const headingHashes = headingMatch[1] || "";
            const headingText = (headingMatch[2] || "").trim();
            const normalizedHeading = headingText.replace(/[*_`]/g, "").trim();
            const normalizedSourceTitle = sourceTitle.trim().toLowerCase();

            if (
                headingHashes.length === 1
                && normalizedHeading.toLowerCase() === normalizedSourceTitle
            ) {
                continue;
            }

            pushSection();
            currentTitle = normalizedHeading || `${sourceTitle} Part ${sectionIndex + 1}`;
            currentLines = [];
            continue;
        }

        currentLines.push(line);
    }

    pushSection();

    const normalizedSections = sections
        .map((section) => ({
            ...section,
            contentMarkdown: section.content,
            content: stripMarkdownNoise(section.content),
        }))
        .filter((section) => section.content.length > 80);

    if (normalizedSections.length === 0) {
        const rawChunks = createParagraphChunks(markdown, sourceTitle, url);
        return rawChunks
            .map((chunk) => ({
                ...chunk,
                contentMarkdown: chunk.content,
                content: stripMarkdownNoise(chunk.content),
            }))
            .filter((chunk) => chunk.content.length > 80);
    }

    if (normalizedSections.length <= 8) {
        return normalizedSections;
    }

    const compactSections: LearnSectionCandidate[] = [];
    let buffer: LearnSectionCandidate | null = null;

    for (const section of normalizedSections) {
        if (!buffer) {
            buffer = { ...section };
            continue;
        }

        const shouldMerge = compactSections.length + 1 >= 8 || buffer.content.length < 500;
        if (shouldMerge) {
            buffer = {
                ...buffer,
                title: `${buffer.title} + ${section.title}`,
                content: `${buffer.content}\n\n${section.content}`.trim(),
                contentMarkdown:
                    `${buffer.contentMarkdown ?? ""}\n\n${section.contentMarkdown ?? ""}`
                        .trim(),
            };
        } else {
            compactSections.push(buffer);
            buffer = { ...section };
        }
    }

    if (buffer) {
        compactSections.push(buffer);
    }

    return compactSections.slice(0, 8);
};

const buildLearnSectionCandidates = async (
    contextLinks: string[],
    event: H3Event,
): Promise<LearnSectionCandidate[]> => {
    const candidates: LearnSectionCandidate[] = [];

    for (const link of contextLinks) {
        const section = await openLink(link, event);
        if (!section?.contentRaw && !section?.content) {
            continue;
        }

        candidates.push(
            ...splitMarkdownIntoLearnSections(
                section.title,
                section.contentRaw || section.content || "",
                section.url,
            ),
        );
    }

    return candidates.filter((candidate) => candidate.content.trim().length > 0);
};

const normalizeQuestions = (questions: unknown): TestQuestion[] => {
    if (!Array.isArray(questions)) return [];

    return questions
        .map((question, index): TestQuestion => {
            const candidate = question as Partial<TestQuestion>;
            const type: TestQuestion["type"] = candidate.type === "multiple_choice"
                ? "multiple_choice"
                : "short_answer";

            return {
                id: candidate.id || `question-${index + 1}`,
                question: candidate.question || `Question ${index + 1}`,
                type,
                options: type === "multiple_choice"
                    ? (candidate.options || []).filter(Boolean)
                    : undefined,
                correctAnswer: candidate.correctAnswer || "",
            };
        })
        .filter((question) => question.question.trim().length > 0);
};

const normalizeLearnPlan = (
    parsedContent: any,
    candidates: LearnSectionCandidate[],
): LearnPlan => {
    const candidateMap = new Map(candidates.map((candidate) => [candidate.id, candidate]));
    const responseSections = Array.isArray(parsedContent?.sections)
        ? parsedContent.sections
        : [];

    const sections = candidates.map((candidate) => {
        const responseSection = responseSections.find((section: any) => section?.id === candidate.id);
        const c = candidateMap.get(candidate.id);

        return {
            id: candidate.id,
            title: responseSection?.title || candidate.title,
            learningGoal:
                responseSection?.learningGoal || `Study the key ideas in ${candidate.title}.`,
            content: c?.contentMarkdown ?? c?.content ?? candidate.content,
            sourceTitle: candidate.sourceTitle,
            url: candidate.url,
        };
    });

    return {
        title: parsedContent?.title || candidates[0]?.sourceTitle || "Learning Plan",
        introduction:
            parsedContent?.introduction
            || "Work through each section in order. Read it, memorize it, and confirm your understanding with the quiz.",
        sections,
    };
};

export const generateLearnPlan = async (
    contextLinks: string[],
    event: H3Event,
): Promise<LearnPlan> => {
    const candidates = await buildLearnSectionCandidates(contextLinks, event);

    if (candidates.length === 0) {
        throw new Error("No learnable content found for the selected context.");
    }

    const groq = createGroqClient();
    const response = await groq.chat.completions.create({
        model: DEFAULT_LLM_MODEL,
        messages: [
            { role: "system", content: systemPromptForLearnPlan },
            {
                role: "user",
                content: `Create a learning plan for these sections:\n${JSON.stringify(
                    candidates.map((candidate) => ({
                        id: candidate.id,
                        title: candidate.title,
                        sourceTitle: candidate.sourceTitle,
                        content: truncateText(candidate.content, 1800),
                    })),
                )}`,
            },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
    });

    const parsedContent = JSON.parse(getResponseContent(response));
    return normalizeLearnPlan(parsedContent, candidates);
};

export const generateLearnSectionQuiz = async (
    section: { title: string; content: string; learningGoal?: string },
): Promise<TestQuestion[]> => {
    const groq = createGroqClient();
    const response = await groq.chat.completions.create({
        model: DEFAULT_LLM_MODEL,
        messages: [
            { role: "system", content: systemPromptForLearnQuiz },
            {
                role: "user",
                content: `Section Title: ${section.title}\nLearning Goal: ${
                    section.learningGoal || "Understand the section."
                }\nSection Content:\n${truncateText(section.content, 2600)}`,
            },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
    });

    const parsedContent = JSON.parse(getResponseContent(response));
    return normalizeQuestions(parsedContent.questions);
};

export const gradeLearnSectionQuiz = async (
    section: { title: string; content: string },
    questions: TestQuestion[],
    answers: TestAnswer[],
): Promise<TestGrading[]> => {
    const groq = createGroqClient();
    const response = await groq.chat.completions.create({
        model: DEFAULT_LLM_MODEL,
        messages: [
            { role: "system", content: systemPromptForGrading },
            {
                role: "user",
                content:
                    `Context:\nTitle: ${section.title}\nContent: ${
                        truncateText(section.content, 2600)
                    }\n\nQuestions:\n${JSON.stringify(questions)}\n\nUser Answers:\n${
                        JSON.stringify(answers)
                    }\n\nGrade the test.`,
            },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
    });

    const parsedContent = JSON.parse(getResponseContent(response));
    return (parsedContent.grading || []) as TestGrading[];
};

export const summarizeLearningSession = async (
    planTitle: string,
    results: LearningSessionResult[],
): Promise<{ summary: string; strengths: string[]; reviewTopics: string[] }> => {
    const groq = createGroqClient();
    const response = await groq.chat.completions.create({
        model: DEFAULT_LLM_MODEL,
        messages: [
            { role: "system", content: systemPromptForLearningSessionSummary },
            { role: "user", content: `Plan Title: ${planTitle}\nResults:\n${JSON.stringify(results)}` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
    });

    const parsedContent = JSON.parse(getResponseContent(response));
    return {
        summary: parsedContent.summary || "You completed the learning plan.",
        strengths: Array.isArray(parsedContent.strengths)
            ? parsedContent.strengths.filter(Boolean)
            : [],
        reviewTopics: Array.isArray(parsedContent.reviewTopics)
            ? parsedContent.reviewTopics.filter(Boolean)
            : [],
    };
};
