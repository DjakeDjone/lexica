<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import type { LearnPlanSection } from '~/types/learn';

const props = defineProps<{
    section: LearnPlanSection;
    content: string;
    isBusy: boolean;
    loadingAction: 'plan' | 'quiz' | 'grading' | 'summary' | null;
}>();

defineEmits<{
    'memorized': [];
}>();

const md = new MarkdownIt();
const renderedContent = computed(() => md.render(props.content));
</script>

<template>
    <div class="mt-5">
        <div class="prose max-w-none" v-html="renderedContent"></div>
        <div class="mt-5 flex flex-wrap items-center gap-2">
            <button class="btn btn-primary" @click="$emit('memorized')" :disabled="isBusy">
                <Icon v-if="loadingAction === 'quiz'" name="mdi:loading" class="animate-spin" />
                <Icon v-else name="mdi:check-bold" />
                Memorized
            </button>
            <span class="text-sm opacity-70">Ask Lexa below if you want clarification before the
                quiz.</span>
        </div>
    </div>
</template>
