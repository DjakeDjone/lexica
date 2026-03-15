import type {
    LearnPlan,
    SectionProgress,
    LearningSummary,
    LearnStage,
    LoadingAction,
} from '~/types/learn';

export const useLearnMode = (context: Ref<any[]>) => {
    const plan = ref<LearnPlan | null>(null);
    const stage = ref<LearnStage>('idle');
    const loadingAction = ref<LoadingAction>(null);
    const currentIndex = ref(0);
    const error = ref<string | null>(null);
    const finalSummary = ref<LearningSummary | null>(null);
    const progressBySection = ref<Record<string, SectionProgress>>({});

    const currentSection = computed(() => plan.value?.sections[currentIndex.value] || null);
    const currentProgress = computed(() => {
        const section = currentSection.value;
        if (!section) return null;
        return progressBySection.value[section.id] || null;
    });
    const hasContext = computed(() => context.value.length > 0);
    const isBusy = computed(() => loadingAction.value !== null);
    const originalSummaryUrl = computed(() => context.value[0]?.url || null);
    const completedCount = computed(() =>
        Object.values(progressBySection.value).filter((item) => item.passed).length
    );
    const isLastSection = computed(() => {
        if (!plan.value) return false;
        return currentIndex.value === plan.value.sections.length - 1;
    });
    const progressValue = computed(() => {
        if (!plan.value) return 0;
        if (stage.value === 'complete') return plan.value.sections.length;
        return Math.min(plan.value.sections.length, completedCount.value + 1);
    });

    const resetLearningState = () => {
        plan.value = null;
        stage.value = 'idle';
        loadingAction.value = null;
        currentIndex.value = 0;
        error.value = null;
        finalSummary.value = null;
        progressBySection.value = {};
    };

    watch(
        () => context.value.map((item) => item.id).join('|'),
        () => {
            resetLearningState();
        }
    );

    const getSectionProgress = (sectionId: string): SectionProgress => {
        const existing = progressBySection.value[sectionId];
        if (existing) return existing;

        const initialState: SectionProgress = {
            questions: [],
            answers: [],
            grading: [],
            attempts: 0,
            passed: false,
        };
        progressBySection.value = {
            ...progressBySection.value,
            [sectionId]: initialState,
        };
        return initialState;
    };

    const postAi = async (body: Record<string, unknown>) => {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const payload = await response.json().catch(() => null);
            throw new Error(payload?.statusMessage || `${response.status} ${response.statusText}`);
        }

        return response.json();
    };

    const startLearning = async () => {
        if (!hasContext.value) {
            error.value = 'Select a summary first before starting Lern Mode Pro.';
            return;
        }

        loadingAction.value = 'plan';
        error.value = null;
        finalSummary.value = null;
        progressBySection.value = {};

        try {
            const result = await postAi({
                action: 'generate_learn_plan',
                context: context.value.map((item) => item.id),
            });
            plan.value = result;
            currentIndex.value = 0;
            stage.value = 'study';
        } catch (err: any) {
            error.value = err.message || 'Failed to start learn mode.';
        } finally {
            loadingAction.value = null;
        }
    };

    const openQuiz = async () => {
        const section = currentSection.value;
        if (!section) return;

        const sectionProgress = getSectionProgress(section.id);
        error.value = null;

        if (sectionProgress.questions.length > 0) {
            stage.value = 'quiz';
            return;
        }

        loadingAction.value = 'quiz';

        try {
            const result = await postAi({
                action: 'generate_learn_quiz',
                section,
            });
            sectionProgress.questions = result.questions || [];
            stage.value = 'quiz';
        } catch (err: any) {
            error.value = err.message || 'Failed to generate quiz for this section.';
        } finally {
            loadingAction.value = null;
        }
    };

    const finishLearning = async () => {
        if (!plan.value) return;

        loadingAction.value = 'summary';
        error.value = null;

        try {
            const results = plan.value.sections.map((section) => {
                const sectionProgress = getSectionProgress(section.id);
                return {
                    title: section.title,
                    learningGoal: section.learningGoal,
                    passed: sectionProgress.passed,
                    attempts: sectionProgress.attempts,
                };
            });

            finalSummary.value = await postAi({
                action: 'summarize_learning_session',
                planTitle: plan.value.title,
                results,
            });
            stage.value = 'complete';
        } catch (err: any) {
            error.value = err.message || 'Failed to summarize the learning session.';
        } finally {
            loadingAction.value = null;
        }
    };

    const submitQuiz = async (answers: { questionId: string; answer: string }[]) => {
        const section = currentSection.value;
        if (!section) return;

        const sectionProgress = getSectionProgress(section.id);
        loadingAction.value = 'grading';
        error.value = null;

        try {
            const result = await postAi({
                action: 'grade_learn_quiz',
                section,
                questions: sectionProgress.questions,
                answers,
            });

            sectionProgress.answers = answers;
            sectionProgress.grading = result.grading || [];
            sectionProgress.attempts += 1;
            sectionProgress.passed =
                sectionProgress.grading.length > 0 &&
                sectionProgress.grading.every((item) => item.correct);

            if (sectionProgress.passed && isLastSection.value) {
                await finishLearning();
                return;
            }

            stage.value = 'feedback';
        } catch (err: any) {
            error.value = err.message || 'Failed to grade the quiz.';
        } finally {
            loadingAction.value = null;
        }
    };

    const nextSection = () => {
        if (!plan.value || isLastSection.value) return;
        currentIndex.value += 1;
        stage.value = 'study';
        error.value = null;
    };

    const reviewSection = () => {
        stage.value = 'study';
    };

    const retryQuiz = () => {
        stage.value = 'quiz';
    };

    return {
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
        getSectionProgress,
        startLearning,
        openQuiz,
        finishLearning,
        submitQuiz,
        nextSection,
        reviewSection,
        retryQuiz,
    };
};
