<script setup lang="ts">

const path = ref(useRoute().fullPath);

</script>

<template>
    <main class="max-w-2xl xl:max-w-4xl mt-8">
        <!-- <input type="text" v-model="path" /> -->
        <ContentDoc :path="path">
            <template #not-found>
                <!-- {{ path }} -->
                <NotFound />
            </template>
            <template #empty>
                <h1>Document is empty</h1>
            </template>
        </ContentDoc>
    </main>
</template>