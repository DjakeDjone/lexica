<script setup lang="ts">
const props = defineProps<{
    url: string
}>();

const { data: page, error, status } = await useAsyncData(props.url, () => {
    return queryCollection('docs').path(props.url).first().then((page) => {
        if (!page) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Page not found',
            });
        }
        // replace first heading if same as title
        if (page.body.value.length > 0 && page.body.value[0]![0] === 'h1' && page.body.value[0]![2] === page.title) {
            const body = JSON.parse(JSON.stringify(page.body.value))
            body[0][2] = '';
            page.body.value = body;
        }
        return page;
    });
})


</script>

<template>
    <slot :page="page" :error="error" :status="status" />
</template>