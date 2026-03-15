<script setup lang="ts">
import type { SearchResult } from '~/server/utils/search';

const props = withDefaults(defineProps<{
    context?: SearchResult[];
}>(), {
    context: () => [],
});

const contextRef = ref(props.context);
const isFullscreen = ref(false);
const sectionRef = ref<HTMLElement | null>(null);

watch(
    () => props.context,
    (newContext) => {
        contextRef.value = newContext;
    },
    { deep: true }
);

const toggleFullscreen = async () => {
    const element = sectionRef.value;
    if (!element) return;

    try {
        if (!isFullscreen.value) {
            // Enter fullscreen
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            }
            isFullscreen.value = true;
        } else {
            // Exit fullscreen
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            }
            isFullscreen.value = false;
        }
    } catch (error) {
        console.error('Fullscreen error:', error);
    }
};

// Listen for fullscreen changes
onMounted(() => {
    document.addEventListener('fullscreenchange', () => {
        isFullscreen.value = !!document.fullscreenElement;
    });
});

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', () => {
        isFullscreen.value = !!document.fullscreenElement;
    });
});

const {
    plan,
    stage,
    loadingAction,
    currentIndex,
    error,
    finalSummary,
    progressBySection,
    currentSection,
    currentProgress,
    hasContext,
    isBusy,
    originalSummaryUrl,
    completedCount,
    isLastSection,
    progressValue,
    resetLearningState,
    startLearning,
    openQuiz,
    submitQuiz,
    nextSection,
    selectSection,
    reviewSection,
    retryQuiz,
} = useLearnMode(contextRef);
</script>

<template>
    <!-- Outer wrapper: main card on the left, plan panel on the right -->
    <div class="flex gap-5 items-start justify-center" :class="{'max-w-2xl mx-auto': !plan}">
        <LexaLearnModePlanSidebar v-if="plan" :plan="plan" :currentIndex="currentIndex"
            :progressBySection="progressBySection" @select-section="selectSection" />

        <section
            ref="sectionRef"
            class="min-w-0 flex-1 mb-6 rounded-3xl border border-base-300 bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-6 shadow-sm"
            :class="{'fixed inset-0 z-50 m-0 rounded-none overflow-auto': isFullscreen}">
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div
                            class="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            <Icon name="mdi:brain" />
                            Lern Mode Pro
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <NuxtLink v-if="originalSummaryUrl" :to="originalSummaryUrl" class="btn btn-sm btn-ghost">
                            <Icon name="mdi:file-document-outline" />
                            Back to Summary
                        </NuxtLink>
                        <button class="btn btn-sm btn-outline" @click="resetLearningState" :disabled="isBusy">
                            Reset
                        </button>
                        <button class="btn btn-sm btn-outline" @click="toggleFullscreen">
                            <Icon :name="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" />
                        </button>
                    </div>
                </div>
                <h2 class="text-3xl font-bold">
                    <span class="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent font-bold">Experimental:</span>
                    Study the summary step by step</h2>
                <p class="mt-2 max-w-2xl text-sm opacity-80">
                    The plan stays anchored to the selected summary. Read one section, mark it as memorized,
                    then verify it with a short quiz before moving on.
                </p>

                <div v-if="error" class="alert alert-error text-sm">
                    <Icon name="mdi:alert-circle-outline" />
                    <span>{{ error }}</span>
                </div>

                <div v-if="!hasContext"
                    class="rounded-2xl border border-dashed border-base-300 bg-base-100 p-5 text-sm opacity-80">
                    Lern Mode Pro needs a selected summary context. Open a summary and use the button in the top-right
                    corner.
                </div>

                <LexaLearnModeInitial v-else-if="!plan" :isBusy="isBusy" :loadingAction="loadingAction"
                    @start-learning="startLearning" />

                <!-- When plan is active: only show the section content (no plan sidebar here) -->
                <div v-else class="flex flex-col gap-5">
                    <div>
                        <div class="mb-2 flex items-center justify-between gap-3 text-sm">
                            <div>
                                <div class="font-semibold">{{ plan.title }}</div>
                                <div class="opacity-70">{{ plan.introduction }}</div>
                            </div>
                            <div class="hidden sm:block text-nowrap rounded-full bg-base-300 px-3 py-1 text-xs font-semibold">
                                {{ completedCount }} / {{ plan.sections.length }}
                            </div>
                        </div>
                        <progress class="progress progress-primary w-full" :value="progressValue"
                            :max="plan.sections.length"></progress>
                    </div>

                    <LexaLearnModeSectionContent :stage="stage" :section="currentSection" :currentProgress="currentProgress"
                        :loadingAction="loadingAction" :isBusy="isBusy" :isLastSection="isLastSection"
                        :sectionIndex="currentIndex" :totalSections="plan.sections.length"
                        :finalSummary="finalSummary" :content="currentSection?.content || ''"
                        :originalSummaryUrl="originalSummaryUrl" @memorized="openQuiz" @next-section="nextSection"
                        @review-section="reviewSection" @retry-quiz="retryQuiz" @submit-quiz="submitQuiz"
                        @retake-plan="startLearning" />
                </div>
            </div>
        </section>
    </div>
</template>