export const useAiHandler = () => {
    const status = ref({
        error: null as string | null,
        loading: false,
    });
    const history = ref<{ role: 'user' | 'system' | 'assistant'; content: string }[]>([]);

    const askAi = async (question: string) => {
        status.value.error = null;
        status.value.loading = true;
        history.value.push({ role: 'user', content: question });

        try {
            // streaming response from /api/ai
            const response = await fetch(`/api/ai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    history: history.value,
                })
            });
            if (!response.ok || !response.body) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let aiResponse = '';
            history.value.push({ role: 'assistant', content: aiResponse });

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                if (chunkValue === 'done') {
                    break;
                }
                aiResponse += chunkValue;
                history.value[history.value.length - 1].content = aiResponse;
            }

        } catch (error: any) {
            console.error("Error in askAi:", error);
            status.value.error = error.message || 'An error occurred while communicating with the AI.';
        } finally {
            status.value.loading = false;
        }
    };

    return {
        status,
        history,
        askAi,
    };
}