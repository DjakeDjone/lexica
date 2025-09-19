<script setup lang="ts">

import type { DocsCollectionItem, MinimalNode } from '@nuxt/content';


const props = defineProps<{
    page: DocsCollectionItem,
    maxDepth?: number,
    exclude?: string[],
}>();

const headings = computed(() => {
    let headings = [];
    for (const tag of props.page.body.value) {
        if (tag[0].startsWith('h')) {
            const level = parseInt(tag[0].substring(1));
            if (level <= (props.maxDepth || 6)) {
                headings.push(tag);
            }
        }
    }
    return headings;
});

const getLink = (text: {
    id: string
}) => {
    return `#${text.id}`;
}

const getMargin = (tag: string) => {
    if (!tag.startsWith('h')) return '0';
    let level = parseInt(tag.substring(1));
    if (isNaN(level) || level < 1 || level > 6) return '0';
    level = Math.min(level-2, 6);
    if (level < 0) level = 0;
    return `${(level) * 1.5}rem`;
}


</script>

<template>
    <nav class="table-of-contents">
        <slot name="title">
            <h2 class="text-lg font-semibold mb-2">Table of Contents</h2>
        </slot>
        <ul>
            <li v-for="(heading, index) in headings" :key="index">
                <NuxtLink :to="getLink(heading[1] as any)" class="text-sm no-underline hover:underline scroll-smooth"
                :style="{ marginLeft: getMargin(heading[0]) }">
                    <span>
                        {{ heading.length > 3 ? heading[3] : heading[2] }}
                    </span>
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>