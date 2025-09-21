<script setup lang="ts">

const filePath = defineModel<string>('filePath', { type: String, default: '/' });

const viewPages = [
    { name: 'MD', pathSuffix: '' },
    { name: 'Protocol', pathSuffix: '/protocol' },
    { name: 'Learn Math', pathSuffix: '/learn-math' },
];

const route = useRoute();

const setPath = (newPath: string) => {
    console.log('setPath', newPath);
    // replace suffixes of viewPages
    let basePath = newPath;
    for (const page of viewPages) {
        if (basePath.endsWith(page.pathSuffix) && page.pathSuffix !== '') {
            basePath = basePath.slice(0, -page.pathSuffix.length);
            break;
        }
    }
    console.log('basePath', basePath);
    filePath.value = basePath;
}

watch(() => route.path, (newPath) => {
    setPath(newPath);
}, { immediate: true });

</script>


<template>
    <nav class="flex gap-4 mb-4 *:btn *:btn-sm">
        <NuxtLink v-for="page in viewPages" :key="page.name" :to="`${filePath}${page.pathSuffix}`">{{ page.name }}
        </NuxtLink>
    </nav>
</template>

<style scoped>
.router-link-active {
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
}
</style>