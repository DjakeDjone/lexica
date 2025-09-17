<script setup lang="ts">

const path = ref(useRoute().fullPath);
const mode = ref<'text' | 'protocol'>('text');

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
    <main class="mt-8">
        <div class="*:btn *:btn-sm">
            <button @click="mode = 'text'" v-if="mode != 'text'">Text</button>
            <button @click="mode = 'protocol'" v-if="mode != 'protocol'">HTL Protokoll</button>
        </div>
        <div v-if="mode == 'text'" class="prose dark:prose-invert max-w-screen">
            <h1 v-if="page && page.title" class="font-bold">
                {{ page?.title }}
            </h1>
            <TableOfContents :page="page" v-if="page?.generateTableOfContents" />
            <ImagePopupContainer>
                <ContentRenderer v-if="page" :value="page">
                </ContentRenderer>
                <div v-else>
                    <p>Loading...</p>
                </div>
            </ImagePopupContainer>
        </div>
        <div v-else-if="error?.statusCode === 404" class="text-center">
            <h1 class="text-2xl font-bold">Page not found</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
        <div v-else-if="status === 'pending'" class="text-center">
            <p>Loading...</p>
        </div>
        <div v-else-if="error" class="text-center">
            Unknown error
        </div>
        <div v-else-if="mode == 'protocol'" class="prose dark:prose-invert max-w-screen">
            <DownloadProtocol :page="page" v-if="page" />
            <div v-else>
                <p>Loading...</p>
            </div>
        </div>
    </main>
</template>