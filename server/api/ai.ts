import type { SearchResult } from "../utils/search";
import { askLLM } from "../utils/llm/chat";
import {
    generateLearnPlan,
    generateLearnSectionQuiz,
    gradeLearnSectionQuiz,
    summarizeLearningSession,
} from "../utils/llm/learning";
import { parseSalaryFromText } from "../utils/llm/salary";
import { generateTest, gradeTest } from "../utils/llm/testing";

const UPSTREAM_NETWORK_ERROR_CODES = new Set([
    "EAI_AGAIN",
    "ECONNREFUSED",
    "ECONNRESET",
    "ENETUNREACH",
    "ENOTFOUND",
    "ETIMEDOUT",
]);

const extractErrorCode = (error: unknown): string | undefined => {
    let current = error as { code?: string; cause?: unknown } | undefined;
    let depth = 0;

    while (current && depth < 6) {
        if (typeof current.code === "string") {
            return current.code;
        }

        current = current.cause as { code?: string; cause?: unknown } | undefined;
        depth += 1;
    }

    return undefined;
};

const mapApiError = (error: any) => {
    const code = extractErrorCode(error);
    const statusCode = error?.statusCode || error?.status;

    if (code && UPSTREAM_NETWORK_ERROR_CODES.has(code)) {
        return {
            statusCode: 503,
            statusMessage:
                "AI service is temporarily unavailable because the upstream provider could not be reached.",
            data: {
                code,
                error: error?.message || "Upstream network error",
            },
        };
    }

    if (error?.message === "Connection error.") {
        return {
            statusCode: 503,
            statusMessage:
                "AI service is temporarily unavailable because the upstream provider connection failed.",
            data: {
                code,
                error: error?.message,
            },
        };
    }

    return {
        statusCode: statusCode || 500,
        statusMessage: error?.message || "Internal server error",
        data: {
            code,
            error: error?.error || error?.message,
        },
    };
};

export default defineEventHandler(async (event) => {
    console.log("Received request at /api/ai");

    try {
        const body = await readBody(event);
        const question = body.question as string;
        const history = body.history as {
            role: "user" | "system" | "assistant";
            content: string;
        }[] || [];
        const context = body.context as string[] | undefined;
        const withoutContext = body.withoutContext as boolean | undefined;
        const useTools = body.useTools as boolean | undefined; // New parameter to enable tool-based search
        const model = body.model as string | undefined;
        const action =
            body.action as
                | "chat"
                | "generate_learn_plan"
                | "generate_learn_quiz"
                | "grade_learn_quiz"
                | "summarize_learning_session"
                | "generate_test"
                | "grade_test"
                | "parse_salary" ||
            "chat";

        if (action === "generate_learn_plan") {
            if (!context || context.length === 0) {
                throw createError({
                    statusCode: 400,
                    statusMessage: "Context is required for learn mode",
                });
            }

            const result = await generateLearnPlan(context, event);
            return result;
        }

        if (action === "generate_learn_quiz") {
            const section = body.section as {
                title: string;
                content: string;
                learningGoal?: string;
            } | undefined;

            if (!section?.title || !section.content) {
                throw createError({
                    statusCode: 400,
                    statusMessage: "Section content is required to generate a learn quiz",
                });
            }

            const questions = await generateLearnSectionQuiz(section);
            return { questions };
        }

        if (action === "grade_learn_quiz") {
            const section = body.section as {
                title: string;
                content: string;
            } | undefined;
            const questions = body.questions as any[] | undefined;
            const answers = body.answers as any[] | undefined;

            if (!section?.title || !section.content || !questions || !answers) {
                throw createError({
                    statusCode: 400,
                    statusMessage: "Section, questions, and answers are required for learn quiz grading",
                });
            }

            const grading = await gradeLearnSectionQuiz(section, questions as any, answers as any);
            return { grading };
        }

        if (action === "summarize_learning_session") {
            const planTitle = body.planTitle as string | undefined;
            const results = body.results as {
                title: string;
                learningGoal: string;
                passed: boolean;
                attempts: number;
            }[] | undefined;

            if (!planTitle || !results) {
                throw createError({
                    statusCode: 400,
                    statusMessage: "Plan title and results are required for learning summaries",
                });
            }

            return await summarizeLearningSession(planTitle, results);
        }

        if (action === "generate_test") {
            if (!context || context.length === 0) {
                throw createError({
                    statusCode: 400,
                    statusMessage: "Context is required for test generation",
                });
            }
            const result = await generateTest(context, event);
            return result;
        }

        if (action === "grade_test") {
            const questions = body.questions as any[];
            const answers = body.answers as any[];

            if (!questions || !answers || !context) {
                throw createError({
                    statusCode: 400,
                    statusMessage:
                        "Questions, answers, and context are required for grading",
                });
            }

            const result = await gradeTest(questions, answers, context, event);
            return result;
        }

        if (action === "parse_salary") {
            const text = body.text as string;
            if (!text) {
                throw createError({
                    statusCode: 400,
                    statusMessage: "Text is required for salary parsing",
                });
            }
            // Use the model from body if provided, otherwise default will be used in util
            const result = await parseSalaryFromText(text, model);
            return result;
        }

        if (!question) {
            throw createError({
                statusCode: 400,
                statusMessage: "Question is required",
            });
        }

        const aiSettings = {
            model,
            useTools: useTools ?? false, // Default to false for backward compatibility
        };

        const { response: aiResponse, relevantSections } = await askLLM(
            question,
            history,
            event,
            context,
            withoutContext,
            aiSettings,
        );
        const readable = await createAiStream(aiResponse, relevantSections);

        return sendStream(event, readable);
    } catch (error: any) {
        console.error("[API] Error in /api/ai:", error);
        const mappedError = mapApiError(error);

        throw createError({
            statusCode: mappedError.statusCode,
            statusMessage: mappedError.statusMessage,
            data: mappedError.data,
        });
    }
});

const createAiStream = async (
    groqStream: any,
    relevantSections: SearchResult[],
) => {
    const { Readable } = await import("stream");

    const readable = new Readable({
        read() {},
    });

    // Send relevantSections as the first chunk (JSON stringified, prefixed for client parsing)
    readable.push(
        `$SOURCES$${
            JSON.stringify(relevantSections.map((section) => ({
                title: section.title,
                url: section.url ??
                    section.id.replace("docs", "").replace(".md", ""),
            })))
        }\n$SOURCES$\n`,
    );

    (async () => {
        try {
            for await (const chunk of groqStream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    readable.push(content);
                }
            }
            readable.push(null); // End of stream
        } catch (error) {
            console.error("Error in AI stream processing:", error);
            readable.emit("error", error);
        }
    })();

    return readable;
};
