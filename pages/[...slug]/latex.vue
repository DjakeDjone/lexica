<script setup lang="ts">

const filePath = ref<string>();

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard');
    }).catch((err) => {
        alert('Failed to copy to clipboard: ' + err);
    });
};

</script>

<template>
    <main class="mt-8">
        <ViewNav v-model:file-path="filePath" />
        <FetchDoc v-if="filePath" :url="filePath">
            <template #default="{ page, error, status }">
                <div v-if="page" class="prose dark:prose-invert max-w-screen">
                    <h1 v-if="page && page.title" class="font-bold">
                        {{ page?.title }}
                    </h1>
                    <pre>
                        {{ convertMdToLatex(page?.rawbody).page }}
                    </pre>
                    <h2 class="font-bold">LaTeX Sources:</h2>
                    <pre class="flex flex-col gap-2">
                        <span v-for="(line, index) in convertMdToLatex(page?.rawbody).citations" :key="index">
\bibitem\{ {{ line }} }
                        </span>
                    </pre>
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