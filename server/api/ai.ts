import { askLLM } from "../utils/llm";

export default defineEventHandler(async (event) => {
    console.log("Received request at /api/ai");
    const eventStream = createEventStream(event);

    // no body in sse, so we get it from query
    const question = getQuery(event).question as string;
    const history = JSON.parse((getQuery(event).history as string) || '[]') as { role: 'user' | 'system' | 'assistant'; content: string }[];
    if (!question) {
        throw createError({ statusCode: 400, statusMessage: 'Question is required' });
    }

    const aiResponse = await askLLM(question, history, event);

    // Forward the stream to the client
    for await (const chunk of aiResponse) {
        eventStream.push(`${chunk.choices[0].delta?.content || ''}`);
    }

    return eventStream.send();
});
