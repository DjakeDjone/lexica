<script setup lang="ts">

defineProps<{
    page?: any
}>();

const asideOpened = ref(true);

</script>

<template>
    <aside class="sticky top-0 max-h-screen w-64 resize-x overflow-scroll p-4 border-l border-gray-200 dark:border-gray-700">
        <div class="h-fit">
            <TableOfContents v-if="asideOpened" :page="page" :max-depth="2" no-h1>
                <template #title>
                    <div class="flex justify-between items-center mb-2">
                        <!-- <h2 class="text-2xl font-semibold mb-2 mt-0">On this page</h2> -->
                        <button @click="asideOpened = !asideOpened">
                            <Icon name="line-md:close" size="20" />
                        </button>
                    </div>
                </template>
            </TableOfContents>
            <button v-if="!asideOpened" class="btn btn-sm btn-outline w-full" @click="asideOpened = !asideOpened">
                <Icon name="line-md:menu" size="20" />
            </button>
        </div>
    </aside>
</template>

<style scoped></style>