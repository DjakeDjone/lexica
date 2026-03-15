<script setup lang="ts">
import type { LearnQuestion, LearnGrading } from '~/types/learn';

defineProps<{
    questions: LearnQuestion[];
    userAnswers: { questionId: string; answer: string }[];
    grading: LearnGrading[];
    passed: boolean;
    isLastSection: boolean;
    isBusy: boolean;
}>();

defineEmits<{
    'next-section': [];
    'review-section': [];
    'retry-quiz': [];
}>();
</script>

<template>
    <div class="mt-5">
        <div class="mb-4 rounded-2xl px-4 py-3 text-sm"
            :class="passed ? 'bg-success/10 border border-success/20' : 'bg-warning/10 border border-warning/20'">
            <span v-if="passed">You passed this section. Move on when you are ready.</span>
            <span v-else>Review the section again, then retake the quiz.</span>
        </div>

        <LexaTest :questions="questions" :userAnswers="userAnswers" :grading="grading" />

        <div class="mt-5 flex flex-wrap gap-2">
            <button v-if="!passed" class="btn btn-primary" @click="$emit('review-section')" :disabled="isBusy">
                <Icon name="mdi:book-open-page-variant" />
                Review Again
            </button>
            <button v-if="!passed" class="btn btn-outline" @click="$emit('retry-quiz')" :disabled="isBusy">
                <Icon name="mdi:refresh" />
                Retake Quiz
            </button>
            <button v-if="!isLastSection" class="btn btn-secondary ml-auto" @click="$emit('next-section')" :disabled="isBusy">
                <Icon name="mdi:arrow-right" />
                Next Section
            </button>
        </div>
    </div>
</template>
