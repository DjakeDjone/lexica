<script setup lang="ts">
import type { LearnPlanSection, SectionProgress, LearningSummary } from '~/types/learn';

defineProps<{
    stage: 'study' | 'quiz' | 'feedback' | 'complete';
    section: LearnPlanSection | null;
    currentProgress: SectionProgress | null;
    loadingAction: 'plan' | 'quiz' | 'grading' | 'summary' | null;
    isBusy: boolean;
    isLastSection: boolean;
    sectionIndex: number;
    totalSections: number;
    finalSummary: LearningSummary | null;
    content: string;
    originalSummaryUrl: string | null;
}>();

defineEmits<{
    'memorized': [];
    'next-section': [];
    'review-section': [];
    'retry-quiz': [];
    'submit-quiz': [answers: { questionId: string; answer: string }[]];
    'retake-plan': [];
}>();
</script>

<template>
    <div class="rounded-2xl border border-base-300 bg-base-100 p-5">
        <template v-if="stage === 'complete' && finalSummary">
            <LearnComplete :summary="finalSummary" :originalSummaryUrl="originalSummaryUrl" :isBusy="isBusy"
                @retake-plan="$emit('retake-plan')" />
        </template>

        <template v-else-if="section">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <div class="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
                        Section {{ sectionIndex + 1 }} of {{ totalSections }}
                    </div>
                    <h3 class="mt-1 text-2xl font-bold">{{ section.title }}</h3>
                    <p class="mt-2 rounded-2xl bg-base-200 px-4 py-3 text-sm">
                        <span class="font-semibold">Goal:</span>
                        {{ section.learningGoal }}
                    </p>
                </div>
                <div class="text-xs opacity-60">
                    Source: {{ section.sourceTitle }}
                </div>
            </div>

            <div v-if="loadingAction === 'summary'"
                class="mt-5 flex items-center gap-2 rounded-2xl bg-base-200 px-4 py-3 text-sm opacity-80">
                <Icon name="mdi:loading" class="animate-spin" />
                Building your final learning summary...
            </div>

            <template v-else-if="stage === 'study'">
                <LexaLearnModeStudy :section="section" :content="content" :isBusy="isBusy" :loadingAction="loadingAction"
                    @memorized="$emit('memorized')" />
            </template>

            <template v-else-if="stage === 'quiz'">
                <div class="mt-5">
                    <div class="mb-4 text-sm opacity-75">
                        Answer the quiz before moving to the next section.
                    </div>
                    <LexaTest :questions="currentProgress?.questions || []"
                        :userAnswers="currentProgress?.answers || []" @submit="$emit('submit-quiz', $event)" />
                </div>
            </template>

            <template v-else-if="stage === 'feedback'">
                <LexaLearnModeFeedback :questions="currentProgress?.questions || []"
                    :userAnswers="currentProgress?.answers || []" :grading="currentProgress?.grading || []"
                    :passed="currentProgress?.passed || false" :isLastSection="isLastSection" :isBusy="isBusy"
                    @next-section="$emit('next-section')" @review-section="$emit('review-section')"
                    @retry-quiz="$emit('retry-quiz')" />
            </template>
        </template>
    </div>
</template>
