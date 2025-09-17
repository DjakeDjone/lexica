<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { useAiHandler } from '~/utils/aiHandler';

const prompt = ref('');
const md = new MarkdownIt();
const { history, status, askAi, clearHistory } = useAiHandler();

const selectedContext = defineModel<SearchResult[]>("context");


const askAI = async () => {
    if (!prompt.value.trim()) return;
    await askAi(prompt.value, selectedContext.value || []);
    prompt.value = '';
};


</script>

<template>
    <div class="max-w-3xl mx-auto p-4">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold mb-4">Ask Lexica AI</h1>
            <button class="btn" @click="clearHistory()">
                <!-- Clear Chat -->
                <Icon name="mdi:trash-can-outline" />
            </button>
        </div>
        <LexaSuggestions v-if="!history.length"
            @update:select="prompt = $event" />
        <div class="mb-28">
            <div v-if="status.error" class="bg-red-100 text-red-700 p-2 mb-4 rounded">
                {{ status.error }}
            </div>
            <div id="history" class="mb-4 flex flex-col gap-4">
                <div v-for="(msg, index) in history" :key="index">
                    <LexaMsg :message="msg.role == 'user' ? msg.content : md.render(msg.content || '', { html: true })"
                        :role="msg.role" :sources="msg.sources" :thinking="msg.thinking" />
                </div>
            </div>
        </div>
        <div class="fixed bottom-0 left-0 right-0 flex flex-col justify-center">
            <LexaPrompt v-model:context="selectedContext" v-model="prompt" :loading="status.loading" @ask="askAI" />
        </div>
    </div>
</template>
