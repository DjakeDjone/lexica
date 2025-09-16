<script setup lang="ts">
import {
    useTextareaAutosize
} from '@vueuse/core';

const prompt = defineModel({
    type: String,
    required: true
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

</script>


<template>
    <div @keydown.ctrl.enter="ask()" class="w-full max-w-3xl mx-auto rounded-t-2xl backdrop-blur-md flex flex-col gap-2 bg-accent/10 p-4">
        <textarea ref="textarea" v-model="prompt" placeholder="Enter your question here..."
            class="border-none outline-none resize-none w-full p-2 border rounded max-h-48"></textarea>

        <div id="actions" class="flex justify-end">
            <button class="btn" :disabled="loading" @click="ask()">
                <Icon name="mdi:send" v-if="!loading" class="-rotate-90" />
                <Icon name="mdi:loading" v-else class="animate-spin" />
            </button>
        </div>
    </div>
</template>