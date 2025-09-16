export type ChatMessage = {
    role: 'user' | 'system' | 'assistant';
    content: string;
    sources?: { title: string; url: string }[];
    thinking?: string;
};
export const useAiHandler = () => {
    const status = ref({
        error: null as string | null,
        loading: false,
    });
    const history = ref<ChatMessage[]>([]);

    const llmHistory = (h: ChatMessage[]) => {
        return h.map(msg => ({
            role: msg.role,
            content: msg.content,
        }));
    }

    const askAi = async (question: string) => {
        status.value.error = null;
        status.value.loading = true;

        history.value.push({ role: 'user', content: question });

        try {
            const response = await fetch(`/api/ai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    question,
                    history: llmHistory(history.value),
                })
            });
            if (!response.ok || !response.body) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            history.value.push({ role: 'assistant', content: '', sources: undefined, thinking: undefined });
            const currentAssistantMessage = history.value[history.value.length - 1]!;

            const sourcesPrefix = '$SOURCES$';
            const thinkPrefix = '<think>';
            const thinkSuffix = '</think>';

            let buffer = '';
            let parsingState: 'sources' | 'thinking' | 'content' = 'sources';

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                buffer += decoder.decode(value, { stream: true });

                if (parsingState === 'sources') {
                    const sourcesEndMarker = `\n${sourcesPrefix}\n`;
                    if (buffer.startsWith(sourcesPrefix)) {
                        const sourcesEnd = buffer.indexOf(sourcesEndMarker);
                        if (sourcesEnd !== -1) {
                            const sourcesString = buffer.substring(sourcesPrefix.length, sourcesEnd).trim();
                            try {
                                currentAssistantMessage.sources = JSON.parse(sourcesString);
                            } catch (e) {
                                console.error('Error parsing sources JSON:', e);
                                currentAssistantMessage.sources = [];
                            }
                            buffer = buffer.substring(sourcesEnd + sourcesEndMarker.length);
                            parsingState = 'thinking';
                        }
                    } else if (done || !buffer.startsWith('$')) {
                        currentAssistantMessage.sources = [];
                        parsingState = 'thinking';
                    }
                }

                if (parsingState === 'thinking') {
                    if (buffer.startsWith(thinkPrefix)) {
                        const thinkEnd = buffer.indexOf(thinkSuffix);
                        if (thinkEnd !== -1) {
                            currentAssistantMessage.thinking = buffer.substring(thinkPrefix.length, thinkEnd);
                            buffer = buffer.substring(thinkEnd + thinkSuffix.length);
                            parsingState = 'content';
                        }
                    } else if (done || buffer.length > 0) {
                        currentAssistantMessage.thinking = '';
                        parsingState = 'content';
                    }
                }

                if (parsingState === 'content') {
                    currentAssistantMessage.content = buffer;
                }
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