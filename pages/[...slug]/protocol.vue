<script setup lang="ts">

const filePath = ref<string>();


</script>

<template>
    <main class="mt-8">
        <ViewNav v-model:file-path="filePath"/>
        <FetchDoc v-if="filePath" :url="filePath">
            <template #default="{ page, error, status }">
                <div v-if="error?.statusCode === 404" class="text-center">
                    <h1 class="text-2xl font-bold">Page not found</h1>
                    <p>The page you are looking for does not exist.</p>
                </div>
                <div v-else-if="status === 'pending'" class="text-center">
                    <p>Loading...</p>
                </div>
                <div v-else-if="error" class="text-center">
                    Unknown error
                </div>
                <div v-else class="prose dark:prose-invert max-w-screen">
                    <ViewDownloadProtocol :page="page" v-if="page" />
                    <div v-else>
                        <p>Loading...</p>
                    </div>
                </div>
            </template>
        </FetchDoc>
    </main>
</template>