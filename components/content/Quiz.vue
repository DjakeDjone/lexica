<script setup lang="ts">
import type { Question } from '~/model/quiz';

const carousel = ref<HTMLElement | null>(null);
const items = ref<HTMLElement[]>([]);
const idx = ref(0);



const next = () => {
    idx.value = (idx.value + 1) % items.value.length;
    scrollToCurrentElement();
}

const prev = () => {
    idx.value = (idx.value - 1 + items.value.length) % items.value.length;
    scrollToCurrentElement();
}

const scrollToCurrentElement = () => {
    const item = items.value[idx.value] as HTMLElement;
    carousel.value!.scrollTo({
        left: item.offsetLeft - carousel.value!.offsetLeft,
        behavior: 'smooth'
    });
}

onMounted(() => {
    items.value = carousel.value!.children as unknown as HTMLElement[];
    console.log(items.value);
    // support for keyboard navigation
    // only if the carousel is in viewport
    window.addEventListener('keydown', (e) => {
        if (document.activeElement === document.body) {
            if (e.key === 'ArrowRight') {
                next();
            } else if (e.key === 'ArrowLeft') {
                prev();
            }
        }
    });
});



</script>


<template>
    <main class="max-w-2xl my-4">
        <h1 class="-mb-7">Quiz</h1>
        <div ref="carousel"
            class="max-w-full carousel p-4 gap-2 carousel-center *:carousel-item *:flex-col *:w-[calc(100%-2rem)]">
            <slot></slot>
        </div>
        <div class="flex justify-between">
            <button @click="prev" class="btn btn-primary" :disabled="idx === 0">Prev</button>
            <button @click="next" class="btn btn-primary" :disabled="idx === items.length - 1">Next</button>
        </div>
    </main>
</template>