import { askLLM } from "../utils/llm";

export default defineEventHandler(async (event) => {
    console.log("Received request at /api/ai");
    const eventStream = createEventStream(event);

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

    const aiResponse = await askLLM(question, history, event);

    // Forward the stream to the client
    event.node.res.on('close', () => {
        console.log("Connection closed by client.");
        // Here you could add logic to clean up resources if the LLM call is still in progress.
        // For many stream-based APIs, this might involve aborting a request.
    });

    (async () => {
        try {
            for await (const chunk of aiResponse) {
                if (event.node.res.writableEnded) {
                    console.log("Stream is not writable, stopping.");
                    break;
                }
                const content = chunk.choices[0].delta?.content || '';
                if (content) {
                    await eventStream.push(content);
                }
            }
        } catch (error) {
            console.error("Error during stream processing:", error);
        } finally {
            if (!event.node.res.writableEnded) {
                await eventStream.close();
            }
            console.log("Finished processing request at /api/ai");
        }
    })().catch((error) => {
        console.error("Error in stream processing task:", error);
        if (!event.node.res.writableEnded) {
            eventStream.close().catch(console.error);
        }
    });

    return eventStream.send();
});
