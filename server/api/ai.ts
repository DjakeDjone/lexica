import { askLLM, generateTest, gradeTest } from "../utils/llm";

export default defineEventHandler(async (event) => {
    console.log("Received request at /api/ai");

    try {
        const body = await readBody(event);
        const question = body.question as string;
        const history = body.history as { role: 'user' | 'system' | 'assistant'; content: string }[] || [];
        const context = body.context as string[] | undefined;
        const withoutContext = body.withoutContext as boolean | undefined;
        const useTools = body.useTools as boolean | undefined; // New parameter to enable tool-based search
        const model = body.model as string | undefined;
        const action = body.action as 'chat' | 'generate_test' | 'grade_test' || 'chat';

        if (action === 'generate_test') {
            if (!context || context.length === 0) {
                 throw createError({ statusCode: 400, statusMessage: 'Context is required for test generation' });
            }
            const result = await generateTest(context, event);
            return result;
        }

        if (action === 'grade_test') {
             const questions = body.questions as any[];
             const answers = body.answers as any[];
             
             if (!questions || !answers || !context) {
                  throw createError({ statusCode: 400, statusMessage: 'Questions, answers, and context are required for grading' });
             }

             const result = await gradeTest(questions, answers, context, event);
             return result;
        }

        if (!question) {
            throw createError({ statusCode: 400, statusMessage: 'Question is required' });
        }

        const aiSettings = {
            model,
            useTools: useTools ?? false // Default to false for backward compatibility
        };

        const { response: aiResponse, relevantSections } = await askLLM(
            question, 
            history, 
            event, 
            context, 
            withoutContext,
            aiSettings
        );
        const readable = await createAiStream(aiResponse, relevantSections);

        return sendStream(event, readable);
    } catch (error: any) {
        console.error("[API] Error in /api/ai:", error);
        throw createError({ 
            statusCode: error.status || 500, 
            statusMessage: error.message || 'Internal server error',
            data: {
                error: error.error || error.message
            }
        });
    }

});

const createAiStream = async (groqStream: any, relevantSections: SearchResult[]) => {
    const { Readable } = await import('stream');

    const readable = new Readable({
        read() { }
    });

    // Send relevantSections as the first chunk (JSON stringified, prefixed for client parsing)
    readable.push(`$SOURCES$${JSON.stringify(relevantSections.map(section => ({
        title: section.title, url: section.url
            ?? section.id.replace('docs', '').replace('.md', '')
    })))}\n$SOURCES$\n`);

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
            console.error('Error in AI stream processing:', error);
            readable.emit('error', error);
        }
    })();

    return readable;
}
