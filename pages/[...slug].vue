<script setup lang="ts">

const path = ref(useRoute().fullPath);
const mode = ref<'text' | 'cards'>('text');

const extractPath = (path: string) => {
    // remove # and everything after
    return path.split('#')[0];
}


const route = useRoute()
const { data: page, error, status } = await useAsyncData(route.path, () => {
    return queryCollection('docs').path(route.path).first().then((page) => {
        if (!page) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Page not found',
            });
        }
        // replace first heading if same as title
        if (page.body.value.length > 0 && page.body.value[0][0] === 'h1' && page.body.value[0][2] === page.title) {
            const body = JSON.parse(JSON.stringify(page.body.value))
            body[0][2] = '';
            page.body.value = body;
        }
        return page;
    });
})


</script>

<template>
    <main class="mt-8">
        <div class="*:btn *:btn-sm">
            <button @click="mode = 'text'" v-if="mode != 'text'">Text</button>
            <button @click="mode = 'cards'" v-if="mode != 'cards'">Cards</button>
        </div>
        <div v-if="mode == 'text'" class="prose dark:prose-invert max-w-screen">
            <h1 v-if="page && page.title" class="font-bold">
                {{ page?.title }}
            </h1>
            <TableOfContents :page="page" v-if="page?.generateTableOfContents"/>
            <ContentRenderer v-if="page" :value="page">
            </ContentRenderer>
            <div v-else>
                <p>Loading...</p>
            </div>
        </div>
        <div v-else-if="error?.statusCode === 404" class="text-center">
            <h1 class="text-2xl font-bold">Page not found</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
        <div v-else-if="status === 'pending'" class="text-center">
            <p>Loading...</p>
        </div>
        <div v-else>
            Unknown error
        </div>
    </main>
</template>