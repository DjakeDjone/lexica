<script setup lang="ts">
import type { LearningSummary } from '~/types/learn';

defineProps<{
    summary: LearningSummary | null;
    originalSummaryUrl: string | null;
    isBusy: boolean;
}>();

defineEmits<{
    'retake-plan': [];
}>();
</script>

<template>
    <div v-if="summary">
        <div class="flex items-center gap-2 text-success">
            <Icon name="mdi:check-decagram" />
            <span class="text-sm font-semibold uppercase tracking-[0.2em]">Completed</span>
        </div>
        <h3 class="mt-3 text-2xl font-bold">Learning session complete</h3>
        <p class="mt-3 text-sm leading-6 opacity-90">{{ summary.summary }}</p>

        <div v-if="summary.strengths.length" class="mt-5">
            <h4 class="font-semibold">Strengths</h4>
            <ul class="mt-2 space-y-2 text-sm opacity-80">
                <li v-for="item in summary.strengths" :key="item">{{ item }}</li>
            </ul>
        </div>

        <div v-if="summary.reviewTopics.length" class="mt-5">
            <h4 class="font-semibold">Review next</h4>
            <ul class="mt-2 space-y-2 text-sm opacity-80">
                <li v-for="item in summary.reviewTopics" :key="item">{{ item }}</li>
            </ul>
        </div>

        <div class="mt-6 flex flex-wrap gap-2">
            <button class="btn btn-primary" @click="$emit('retake-plan')" :disabled="isBusy">
                <Icon name="mdi:restart" />
                Retake Learning Plan
            </button>
            <NuxtLink v-if="originalSummaryUrl" :to="originalSummaryUrl" class="btn btn-outline">
                Return to Summary
            </NuxtLink>
        </div>
    </div>
</template>
