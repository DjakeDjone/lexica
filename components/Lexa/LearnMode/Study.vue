<script setup lang="ts">
import type { MDCParserResult } from '@nuxtjs/mdc';
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

const parsedContent = shallowRef<MDCParserResult | null>(null);
const isParsing = ref(false);
let parseRequestId = 0;

watch(
    () => props.content,
    async (content) => {
        const requestId = ++parseRequestId;
        const nextContent = content.trim();

        if (!nextContent) {
            parsedContent.value = null;
            return;
        }

        isParsing.value = true;

        try {
            const parsed = await parseMarkdown(nextContent);

            if (requestId === parseRequestId) {
                parsedContent.value = parsed;
            }
        } catch (error) {
            console.error('Failed to parse learn mode markdown:', error);
            if (requestId === parseRequestId) {
                parsedContent.value = null;
            }
        } finally {
            if (requestId === parseRequestId) {
                isParsing.value = false;
            }
        }
    },
    { immediate: true },
);
</script>

<template>
    <div class="mt-5">
        <div v-if="isParsing" class="flex items-center gap-2 rounded-2xl bg-base-200 px-4 py-3 text-sm opacity-80">
            <Icon name="mdi:loading" class="animate-spin" />
            Rendering section...
        </div>

        <ContentRenderer
            v-else-if="parsedContent"
            :value="parsedContent"
            class="prose dark:prose-invert max-w-none"
        />

        <div v-else class="rounded-2xl bg-base-200 px-4 py-3 text-sm opacity-80">
            This section could not be rendered.
        </div>

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
