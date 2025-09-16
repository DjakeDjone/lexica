<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { useAiHandler } from '~/utils/aiHandler';

const prompt = ref('');
const responseRaw = ref('');
const loading = ref(false);
const error = ref('');
const md = new MarkdownIt();
const { history, askAi } = useAiHandler();


const askAI = async () => {
    askAi(prompt.value);
    prompt.value = '';
};


</script>

<template>
    <div class="max-w-3xl mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Ask Lexica AI</h1>
        <div class="mb-28">
            <div v-if="error" class="bg-red-100 text-red-700 p-2 mb-4 rounded">
                {{ error }}
            </div>
            <div id="history" class="mb-4 flex flex-col gap-4">
                <div v-for="(msg, index) in history" :key="index">
                    <LexaMsg
                        :message="msg.role == 'user' ? msg.content : md.render(msg.content || '', { html: true })"
                        :role="msg.role" :sources="msg.sources" />
                </div>
            </div>
            <!-- <div v-if="responseRaw" class="ai-response p-4 rounded mb-4">
                <LexaMsg :message="renderedResponse" />
            </div> -->
        </div>
        <div class="fixed bottom-0 left-0 right-0 flex justify-center">
            <LexaPrompt v-model="prompt" :loading="loading" @ask="askAI" />
        </div>
    </div>
</template>
