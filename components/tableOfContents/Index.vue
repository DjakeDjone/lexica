<script setup lang="ts">

import type { DocsCollectionItem } from '@nuxt/content';


const props = defineProps<{
    page: DocsCollectionItem,
    maxDepth?: number,
    exclude?: string[],
}>();

const buildTree = (headings: any[]) => {
    const tree: any[] = [];
    const stack: any[] = [];
    for (const tag of headings) {
        const level = parseInt(tag[0].substring(1));
        const node = { tag, children: [] };
        while (stack.length && parseInt(stack[stack.length - 1].tag[0].substring(1)) >= level) {
            stack.pop();
        }
        if (stack.length) {
            stack[stack.length - 1].children.push(node);
        } else {
            tree.push(node);
        }
        stack.push(node);
    }
    return tree;
};

const headings = computed(() => {
    const flat: any[] = [];
    for (const tag of props.page.body.value) {
        if (tag[0].startsWith('h')) {
            const level = parseInt(tag[0].substring(1));
            if (level <= (props.maxDepth || 6)) {
                flat.push(tag);
            }
        }
    }
    return buildTree(flat);
});

const getLink = (text: {
    id: string
}) => {
    return `#${text.id}`;
}

</script>

<template>
    <nav class="table-of-contents">
        <slot name="title">
            <h2 class="text-lg font-semibold mb-2">Table of Contents</h2>
        </slot>
        <ol>
            <TableOfContentsItem v-for="(item, index) in headings" :key="index"
                :heading="item.tag.length > 3 ? item.tag[3] : item.tag[2]" :link="getLink(item.tag as any)"
                :children="item.children" />
        </ol>
    </nav>
</template>