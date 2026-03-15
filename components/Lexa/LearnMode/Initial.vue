<script setup lang="ts">
defineProps<{
    isBusy: boolean;
    loadingAction: 'plan' | 'quiz' | 'grading' | 'summary' | null;
}>();

defineEmits<{
    'start-learning': [];
}>();
</script>

<template>
    <div>
        <h3 class="text-xl font-semibold">Ready to begin</h3>
        <p class="mt-2 text-sm opacity-80">
            Lexa will split the summary into focused study sections, generate a learning goal for each
            part, and guide you through the material in order.
        </p>
        <button class="btn btn-primary mt-5" @click="$emit('start-learning')" :disabled="isBusy">
            <Icon v-if="loadingAction === 'plan'" name="mdi:loading" class="animate-spin" />
            <Icon v-else name="mdi:play" />
            Start Learning
        </button>
    </div>
</template>
