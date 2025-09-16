import { askLLM } from "../utils/llm";

export default defineEventHandler(async (event) => {
    console.log("Received request at /api/ai");

    // no body in sse, so we get it from query
    // const question = getQuery(event).question as string;
    // const history = JSON.parse((getQuery(event).history as string) || '[]') as { role: 'user' | 'system' | 'assistant'; content: string }[];
    // get from body
    const body = await readBody(event);
    const question = body.question as string;
    const history = body.history as { role: 'user' | 'system' | 'assistant'; content: string }[] || [];
    if (!question) {
        throw createError({ statusCode: 400, statusMessage: 'Question is required' });
    }

    const {response: aiResponse, relevantSections } = await askLLM(question, history, event);
    const readable = await createAiStream(aiResponse, relevantSections);

    return sendStream(event, readable);

});

const createAiStream = async (groqStream: any, relevantSections: SearchResult[]) => {
    const { Readable } = await import('stream');

    const readable = new Readable({
        read() { }
    });

    // Send relevantSections as the first chunk (JSON stringified, prefixed for client parsing)
    readable.push(`$SOURCES$${JSON.stringify(relevantSections.map(section => ({ title: section.title, url: section.url })))}\n$SOURCES$\n`);

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
