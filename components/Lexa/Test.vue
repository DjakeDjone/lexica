<script setup lang="ts">
const props = withDefaults(defineProps<{
    questions: any[];
    userAnswers?: any[];
    grading?: any[];
}>(), {
    questions: () => [],
    userAnswers: () => [],
    grading: undefined
});

const emit = defineEmits<{
    (e: 'submit', answers: any[]): void;
}>();

const answers = ref(props.userAnswers && props.userAnswers.length ? [...props.userAnswers] : (Array.isArray(props.questions) ? props.questions.map(q => ({ questionId: q.id, answer: '' })) : []));

watch(() => [props.questions, props.userAnswers], () => {
    if (props.userAnswers && props.userAnswers.length) {
        answers.value = [...props.userAnswers];
    } else if (Array.isArray(props.questions)) {
        answers.value = props.questions.map(q => {
            const existing = answers.value.find(a => a.questionId === q.id);
            return existing || { questionId: q.id, answer: '' };
        });
    }
}, { deep: true, immediate: true });

const submit = () => {
    emit('submit', answers.value);
};

const getGrading = (qId: string) => {
    if (!props.grading) return null;
    return props.grading.find((g: any) => g.questionId === qId);
};
</script>

<template>
    <div class="test-container p-4 bg-base-200 rounded-lg border border-base-300">
        <div v-for="(q, index) in questions" :key="q.id" class="mb-6 last:mb-0">
            <template v-if="answers[index]">
                <p class="font-bold mb-2 text-lg">{{ index + 1 }}. {{ q.question }}</p>

                <div v-if="q.type === 'multiple_choice'" class="flex flex-col gap-2">
                    <div v-for="option in q.options" :key="option"
                        class="flex items-center gap-2 p-2 rounded hover:bg-base-300 transition-colors">
                        <input type="radio" :name="q.id" :value="option" v-model="answers[index].answer"
                            :disabled="!!grading" class="radio radio-primary radio-sm" />
                        <span>{{ option }}</span>
                    </div>
                </div>
                <div v-else>
                    <textarea v-model="answers[index].answer" :disabled="!!grading"
                        class="textarea textarea-bordered w-full" placeholder="Type your answer..."></textarea>
                </div>

                <div v-if="grading" class="mt-3 p-3 rounded bg-base-100 text-sm border-l-4"
                    :class="getGrading(q.id)?.correct ? 'border-green-500' : 'border-red-500'">
                    <div v-if="getGrading(q.id)?.correct" class="text-green-600 font-bold flex items-center gap-1 mb-1">
                        <Icon name="mdi:check-circle" /> Correct
                    </div>
                    <div v-else class="text-red-600 font-bold flex items-center gap-1 mb-1">
                        <Icon name="mdi:close-circle" /> Incorrect
                    </div>
                    <p class="text-base-content/80 italic">{{ getGrading(q.id)?.explanation }}</p>
                </div>
            </template>
        </div>

        <button v-if="!grading" class="btn btn-primary mt-6 w-full" @click="submit"
            :disabled="!answers.length || answers.some(a => !a.answer)">
            <Icon name="mdi:check-all" /> Submit Test
        </button>
    </div>
</template>
