<script setup lang="ts">

const props = defineProps<{
    heading: string,
    link: string,
    children?: any[]
}>();

</script>

<template>
    <li>
        <NuxtLink :to="link" class="text-sm text-blue-500 no-underline hover:underline scroll-smooth">
            <span>
                {{ heading }}
            </span>
        </NuxtLink>
        <ul v-if="children && children.length" class="list-decimal pl-4">
            <TableOfContentsItem v-for="(child, index) in children" :key="index" :heading="child.tag[2]"
                :link="`#${child.tag[1].id}`" :children="child.children" />
        </ul>
    </li>
</template>