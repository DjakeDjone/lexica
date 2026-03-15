<script setup lang="ts">
import type { SearchResult } from '~/server/utils/search';

const route = useRoute();
const context = ref<SearchResult[]>([]);

const syncContextFromRoute = () => {
    if (route.query.contextUrl && route.query.contextTitle) {
        context.value = [{
            id: route.query.contextUrl as string,
            title: route.query.contextTitle as string,
            url: route.query.contextUrl as string,
            content: '',
            titles: [],
            level: 0,
            description: '',
            score: 1,
        }];
        return;
    }

    context.value = [];
};

watch(() => [route.query.contextUrl, route.query.contextTitle], () => {
    syncContextFromRoute();
}, { immediate: true });
</script>

<template>
    <div>
        <Lexa v-model:context="context" />
    </div>
</template>