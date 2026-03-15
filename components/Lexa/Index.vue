<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { useAiHandler } from '~/utils/aiHandler';
import type { SearchResult } from '~/server/utils/search';

const prompt = ref('');
const md = new MarkdownIt();
const sidePanelOpen = ref(false);
const { history, status, askAi, clearHistory } = useAiHandler();

const selectedContext = defineModel<SearchResult[]>("context");
const useTools = ref(true); // Enable tool-based search by default
const selectedModel = ref('openai/gpt-oss-120b'); // Default model for tool usage
const route = useRoute();
const isLearnMode = ref(route.query.learn === 'true');
const isTestMode = ref(route.query.test === 'true' && route.query.learn !== 'true');

watch(() => route.query.learn, (value) => {
    isLearnMode.value = value === 'true';
    if (isLearnMode.value) {
        isTestMode.value = false;
    }
}, { immediate: true });

watch(() => route.query.test, (value) => {
    if (!isLearnMode.value) {
        isTestMode.value = value === 'true';
    }
}, { immediate: true });

const askAI = async () => {
    // If test mode is on, we ignore the prompt text for generation usually, or use it as topic?
    // Plan said "Generate Test" button.
    if (isTestMode.value) {
        if (!selectedContext.value || selectedContext.value.length === 0) {
            alert("Please select context for the test.");
            return;
        }
        await askAi(prompt.value, selectedContext.value, true, selectedModel.value, 'generate_test');
    } else {
        if (!prompt.value.trim()) return;
        await askAi(prompt.value, selectedContext.value || [], useTools.value, selectedModel.value);
    }
    prompt.value = '';
};

const handleTestSubmit = async (msg: any, answers: any[]) => {
    // Reconstruct context from msg sources
    const context = msg.sources?.map((s: any) => ({ id: s.url, title: s.title, url: s.url })) || [];
    await askAi('', context, true, selectedModel.value, 'grade_test', { questions: msg.testData, answers });
};

const handleSuggestionSelect = (selection: { text: string, mode: 'test' | 'rag', context: SearchResult[] }) => {
    prompt.value = selection.text;
    selectedContext.value = selection.context;
    if (selection.mode === 'test') {
        isTestMode.value = true;
    } else {
        isTestMode.value = false;
        useTools.value = true;
    }
};

</script>

<template>
    <div :class="isLearnMode ? '' : 'max-w-3xl'" class="mx-auto md:p-4">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold mb-4">Ask Lexica AI</h1>
            <button v-if="history.length" class="btn" @click="clearHistory()">
                <!-- Clear Chat -->
                <Icon name="mdi:plus" />
            </button>
        </div>
        <LexaSuggestions v-if="!history.length && !isLearnMode" @update:select="handleSuggestionSelect" />
        <div class="mb-32">
            <div v-if="status.error" class="bg-red-100 text-red-700 p-2 mb-4 rounded">
                {{ status.error }}
            </div>
            <LexaLearnMode v-if="isLearnMode" :context="selectedContext || []" />
            <div id="history" class="mb-4 flex flex-col gap-4">
                <div v-for="(msg, index) in history" :key="index">
                    <LexaMsg :message="msg.role == 'user' ? msg.content : md.render(msg.content || '', { html: true })"
                        :role="msg.role" :sources="msg.sources" :thinking="msg.thinking" :type="msg.type"
                        :testData="msg.testData" :userAnswers="msg.userAnswers" :grading="msg.grading"
                        @submit="handleTestSubmit(msg, $event)" />
                </div>
            </div>
        </div>
        <div class="fixed bottom-0 left-0 right-0 flex flex-col justify-center xl:!left-16">
            <LexaPrompt v-model:context="selectedContext" v-model:useTools="useTools" v-model:isTestMode="isTestMode"
                v-model="prompt" :loading="status.loading" :is-learn-mode="isLearnMode" @ask="askAI" />
        </div>
    </div>
</template>
