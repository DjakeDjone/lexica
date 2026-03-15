<script setup lang="ts">
import type { LearnPlan, SectionProgress } from '~/types/learn';

defineProps<{
    plan: LearnPlan;
    currentIndex: number;
    progressBySection: Record<string, SectionProgress>;
}>();

defineEmits<{
    'select-section': [index: number];
}>();
</script>

<template>
    <aside class="hidden lg:block w-72 shrink-0 sticky top-4">
        <h3 class="mb-3 text-sm font-semibold uppercase tracking-[0.18em] opacity-70">Plan</h3>
        <div class="space-y-2">
            <div v-for="(section, index) in plan.sections" :key="section.id"
                class="rounded-2xl border px-3 py-3 text-sm transition-colors" :class="[
                    index === currentIndex ? 'border-primary bg-primary/5' : 'border-base-300',
                    progressBySection[section.id]?.passed ? 'ring-1 ring-success/30' : ''
                ]" role="button" tabindex="0" @click="$emit('select-section', index)"
                @keydown.enter.prevent="$emit('select-section', index)"
                @keydown.space.prevent="$emit('select-section', index)">
                <div class="flex items-start justify-between gap-3 group">
                    <div>
                        <div class="font-semibold">{{ index + 1 }}. {{ section.title }}</div>
                        <div class="mt-1 text-xs opacity-70 h-0 group-hover:h-[5rem] overflow-hidden transition-all"
                            :class="{ 'h-[5rem]': currentIndex == index }">{{ section.learningGoal }}</div>
                    </div>
                    <Icon
                        :name="progressBySection[section.id]?.passed ? 'mdi:check-circle' : index === currentIndex ? 'mdi:circle-slice-8' : 'mdi:circle-outline'"
                        :class="progressBySection[section.id]?.passed ? 'text-success' : index === currentIndex ? 'text-primary' : 'opacity-40'"
                        class="shrink-0 mt-0.5" />
                </div>
            </div>
        </div>
    </aside>
</template>
