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
    isLearnMode?: boolean;
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

// Derived mode value for the select element
const selectedMode = computed({
    get() {
        if (props.isLearnMode) return 'learn';
        if (isTestMode.value) return 'test';
        return 'ask';
    },
    set(value: string) {
        if (value === 'test') {
            isTestMode.value = true;
            useTools.value = false;
        } else if (value === 'ask') {
            isTestMode.value = false;
            useTools.value = true;
        }
        // 'learn' mode is controlled via route, not here
    }
});

const placeholder = computed(() => {
    if (props.isLearnMode) return 'Ask Lexa for help with the current section...';
    if (isTestMode.value) return 'Describe the test topic (optional)...';
    return 'Enter your question here...';
});
</script>


<template>
    <div @keydown.ctrl.enter="ask()"
        class="relative w-full max-w-3xl mx-auto md:rounded-t-2xl backdrop-blur-md flex flex-col gap-2 bg-accent/10 p-4">
        <textarea autofocus ref="textarea" v-model="prompt"
            :placeholder="placeholder"
            class="border-none outline-none resize-none w-full p-2 border rounded max-h-48"></textarea>

        <div v-auto-animate id="actions" class="flex justify-between items-center gap-2">
            <div class="flex items-center gap-2">
                <select
                    v-model="selectedMode"
                    :disabled="props.isLearnMode"
                    class="select select-sm select-bordered"
                    title="Mode"
                >
                    <option value="ask">Ask</option>
                    <option value="test">Test</option>
                    <option value="learn" :disabled="!props.isLearnMode">Learn Mode Pro</option>
                </select>
                <label v-if="selectedMode === 'ask'" class="label cursor-pointer gap-2">
                    <input type="checkbox" v-model="useTools"
                        class="toggle toggle-xs toggle-primary" />
                    <span class="label-text text-xs opacity-70">RAG</span>
                </label>
            </div>
            <div class="flex gap-2">
                <LexaContextSelect v-if="props.isLearnMode || !useTools || isTestMode" v-model="selectedContext" />
                <button class="btn btn-sm btn-primary" :disabled="loading || (prompt.trim() === '' && !isTestMode)"
                    @click="ask()">
                    <Icon name="mdi:school" v-if="isTestMode && !loading" class="mr-1" />
                    <Icon name="mdi:send" v-if="!loading && !isTestMode" class="-rotate-90" />
                    <Icon name="mdi:loading" v-else-if="loading" class="animate-spin" />
                </button>
            </div>
        </div>
    </div>
</template>