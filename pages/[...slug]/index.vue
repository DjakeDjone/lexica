<script setup lang="ts">

const filePath = ref<string>();

</script>

<template>
    <main class="mt-8">
        <ViewNav v-model:file-path="filePath" />
        <FetchDoc v-if="filePath" :url="filePath">
            <template #default="{ page, error, status }">
                <div v-if="page" class="prose dark:prose-invert max-w-screen flex gap-8">
                    <!-- <div class="relative hidden md:block">
                        <TableOfContentsSidebar :page="page" />
                    </div> -->
                    <div class="overflow-x-scroll">
                        <div class="flex justify-between items-center mb-4">
                            <h1 v-if="page && page.title" class="font-bold">
                                {{ page?.title }}
                            </h1>
                            <NuxtLink v-if="page"
                                :to="{ path: '/lexa', query: { test: 'true', contextUrl: filePath, contextTitle: page.title } }"
                                class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium">
                                Test with AI
                            </NuxtLink>
                        </div>
                        <TableOfContents :page="page" v-if="page?.generateTableOfContents" />
                        <ImagePopupContainer>
                            <ContentRenderer v-if="page" :value="page">
                            </ContentRenderer>
                            <div v-else>
                                <p>Loading...</p>
                            </div>
                        </ImagePopupContainer>
                    </div>
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
            </template>
        </FetchDoc>
    </main>
</template>