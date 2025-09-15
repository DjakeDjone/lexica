<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const prompt = ref('');
const responseRaw = ref('');
const loading = ref(false);
const error = ref('');
const md = new MarkdownIt();
const history = ref<{ role: string; content: string; }[]>([]);

const renderedResponse = computed(() => {
    // replace new lines with <br> for HTML rendering
    let html = responseRaw.value.replace(/\n/g, '<br>');
    html =  md.render(html || '', { html: true });

    // replace links starting with '/docs' to full URL
    const docsLink = html.match(/(\/docs\/[^\s]+)/g);
    if (docsLink) {
        docsLink.forEach(link => {
            html = html.replace(link, `<a href="${link}" target="_blank">${link}</a>`);
        });
    }

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
        <textarea v-model="prompt" placeholder="Enter your question here..." class="w-full p-2 border rounded mb-4"
            rows="4"></textarea>
        <button @click="askAI" :disabled="loading"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50">
            {{ loading ? 'Asking...' : 'Ask AI' }}
        </button>
        <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
        <div v-if="responseRaw" class="mt-4 p-4 border rounded">
            <h2 class="text-xl font-semibold mb-2">AI Response:</h2>


            <div class="prose ai-response"><span v-html="renderedResponse"></span></div>

            ---------------------
            {{ renderedResponse }}
            
            <!-- history -->
            <div v-if="history.length" class="mt-4">
                <h3 class="text-lg font-semibold mb-2">Conversation History:</h3>
                <div v-for="(entry, index) in history" :key="index" class="mb-2">
                    <strong>{{ entry.role === 'user' ? 'You' : 'Lexica AI' }}:</strong>
                    <p><span v-html="md.render(entry.content)"></span></p>
                </div>
            </div>
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