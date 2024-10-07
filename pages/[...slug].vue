<script setup lang="ts">

const path = ref(useRoute().fullPath);
const mode = ref<'text' | 'cards'>('text');

const extractPath = (path: string) => {
    // remove # and everything after
    return path.split('#')[0];
}

</script>

<template>
    <main class="mt-8">
        <div class="*:btn *:btn-sm">
            <button @click="mode = 'text'" v-if="mode != 'text'">Text</button>
            <button @click="mode = 'cards'" v-if="mode != 'cards'">Cards</button>
        </div>
        <div v-if="mode == 'text'">
            <ContentDoc :path="extractPath(path)">
                <template #not-found>
                    <!-- {{ path }} -->
                    <NotFound />
                </template>
                <template #empty>
                    <h1>Document is empty</h1>
                </template>
            </ContentDoc>
        </div>
        <div v-else-if="mode == 'cards'">
            <Cards :path="path" />
        </div>
    </main>
</template>