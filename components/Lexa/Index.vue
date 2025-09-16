<script setup lang="ts">
import MarkdownIt from 'markdown-it';

const prompt = ref('');
const responseRaw = ref('');
const loading = ref(false);
const error = ref('');
const md = new MarkdownIt();
const history = ref<{ role: string; content: string; }[]>([]);

const renderedResponse = computed(() => {
    // replace new lines with <br> for HTML rendering
    // let html = responseRaw.value.replace(/\n/g, '<br>');
    let html = responseRaw.value;
    // fix links if they are not properly formatted
    html = md.render(html || '', { html: true });

    return html;
});

let eventSource: EventSource | null = null;

const askAI = async () => {
    if (!prompt.value.trim()) {
        error.value = 'Please enter a question.';
        return;
    }

    loading.value = true;
    error.value = '';
    responseRaw.value = '';

    // Close previous SSE if any
    if (eventSource) {
        eventSource.close();
        eventSource = null;
    }

    try {
        eventSource = new EventSource(`/api/ai?question=${encodeURIComponent(prompt.value)}&history=${encodeURIComponent(JSON.stringify(history.value))}`);
        let answer = '';
        eventSource.onmessage = (event) => {
            if (event.data === 'done') {
                loading.value = false;
                eventSource?.close();
                eventSource = null;
                return;
            }
            if (event.data === '') {
                // line break
                answer += '\n';
                responseRaw.value = answer;
                return;
            }
            answer += event.data;
            console.log("Received chunk:", event.data);
            responseRaw.value = answer;
        };

        eventSource.onerror = (err) => {
            error.value = 'An error occurred while fetching the AI response.';
            loading.value = false;
            eventSource?.close();
            eventSource = null;
        };

        eventSource.onopen = () => {
            loading.value = true;
        };

        eventSource.addEventListener('end', () => {
            history.value.push({ role: 'user', content: prompt.value });
            history.value.push({ role: 'assistant', content: responseRaw.value });
            prompt.value = '';
            loading.value = false;
            eventSource?.close();
            eventSource = null;
        });
    } catch (err: any) {
        error.value = err.message || 'An error occurred while fetching the AI response.';
        loading.value = false;
    }
};

onBeforeUnmount(() => {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
    }
});

</script>

<template>
    <div class="max-w-3xl mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Ask Lexica AI</h1>
        <div>
            <div v-if="error" class="bg-red-100 text-red-700 p-2 mb-4 rounded">
                {{ error }}
            </div>
            <div v-if="responseRaw" class="ai-response p-4 rounded mb-4">
                <LexaMsg :message="renderedResponse" />
            </div>
        </div>
        <div class="fixed bottom-0 left-0 right-0 flex justify-center">
            <LexaPrompt v-model="prompt" :loading="loading" @ask="askAI" />
        </div>
    </div>
</template>

<style scoped>
.ai-response strong {
    /* new lines for bold */
    display: block;
    margin-top: 1em;
    font-weight: bold;
}
</style>