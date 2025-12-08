<script setup lang="ts">
import {
    useTextareaAutosize
} from '@vueuse/core';
import type { SearchResult } from '~/server/utils/search';

const prompt = defineModel({
    type: String,
    required: true
});
const useTools = defineModel<boolean>("useTools", {
    type: Boolean,
    default: true
});

const props = defineProps<{
    loading: boolean;
}>();

const emit = defineEmits<{
    (e: 'ask'): void;
}>();

const ask = () => {
    emit('ask');
};

const { textarea } = useTextareaAutosize({ input: prompt, styleProp: 'height' });

const selectedContext = defineModel<SearchResult[]>("context");
const isTestMode = defineModel<boolean>("isTestMode", { default: false });

</script>


<template>
    <div @keydown.ctrl.enter="ask()"
        class="relative w-full max-w-3xl mx-auto md:rounded-t-2xl backdrop-blur-md flex flex-col gap-2 bg-accent/10 p-4">
        <textarea autofocus ref="textarea" v-model="prompt"
            :placeholder="isTestMode ? 'Describe the test topic (optional)...' : 'Enter your question here...'"
            class="border-none outline-none resize-none w-full p-2 border rounded max-h-48"></textarea>

        <div v-auto-animate id="actions" class="flex justify-between items-center gap-2">
            <div class="flex items-center gap-2" v-auto-animate>
                <label class="label cursor-pointer gap-2" v-if="!isTestMode">
                    <input type="checkbox" v-model="useTools" :disabled="isTestMode"
                        class="toggle toggle-sm toggle-primary" />
                    <span class="label-text text-xs">RAG</span>
                </label>
                <label class="label cursor-pointer gap-2">
                    <input type="checkbox" v-model="isTestMode" class="toggle toggle-sm toggle-secondary" />
                    <span class="label-text text-xs">Test</span>
                </label>
            </div>
            <div class="flex gap-2">
                <LexaContextSelect v-if="!useTools || isTestMode" v-model="selectedContext" />
                <button class="btn btn-sm btn-primary" :disabled="loading || (prompt.trim() === '' && !isTestMode)"
                    @click="ask()">
                    <!-- <span v-if="isTestMode && !loading" class="mr-1">Generate Test</span> -->
                    <Icon name="mdi:school" v-if="isTestMode && !loading" class="mr-1" />
                    <Icon name="mdi:send" v-if="!loading && !isTestMode" class="-rotate-90" />
                    <Icon name="mdi:loading" v-else-if="loading" class="animate-spin" />
                </button>
            </div>
        </div>
    </div>
</template>