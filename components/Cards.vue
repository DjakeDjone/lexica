<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content';


const props = defineProps<{
    path: string;
}>();

export interface Card {
    front: string;
    back: string;
}

const { data } = await useAsyncData('home', () => queryContent('/').findOne())

const getMD = async (path: string) => {
    const res = await fetch(path);
    return await res.text();
};

onMounted(() => {

});

const parseCards = (d: ParsedContent) => {
    const cards: Card[] = [];
}

const cards = useState('cards', () => [
    { front: "<h1>Front</h1>", back: "<h1>Back</h1>" },
]);

</script>


<template>
    <main>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="card in cards" :key="card.front" class="bg-white shadow-md p-4">
                <div v-html="card.front"></div>
                <div v-html="card.back"></div>
            </div>
        </div>
    </main>
</template>