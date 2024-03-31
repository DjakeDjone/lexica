<script setup lang="ts">
import type { NavItem } from '~/app.vue';


const searchVlue = ref('');

const value = defineModel();


const emit = defineEmits(['update:close']);
const searchResults = ref([] as any[]);

const search = async (e: KeyboardEvent | MouseEvent) => {
    if (e instanceof KeyboardEvent && e.key !== 'Enter') return;
    // SHIFT + ENTER
    if (e instanceof KeyboardEvent && e.shiftKey) return;
    e.preventDefault();
    if (searchVlue.value.length > 0) {
        searchResults.value = (await queryContent().where({
            title: {
                $contains: searchVlue.value
            }
        }).limit(7)
        .find()).result;
    } else {
        searchResults.value = [];
    }
}
onMounted(() => {
    // focus search input
    const searchInput = document.querySelector('.textarea') as HTMLTextAreaElement;
    searchInput.focus();
    searchInput.select();
});


const close = () => {
    emit('update:close', false);
}


</script>

<template>
    <main class="w-screen h-screen flex justify-center items-center">
        <label @click="close()"
            class="drawer-overlay h-full w-full absolute top-0 left-0 bg-black/10 backdrop-blur-sm"></label>
        <div class="z-10 p-2 rounded-[.625rem] w-full max-w-md">
            <div class=" w-full flex items-start gap-2">
                <textarea class="textarea resize-none w-full h-8" v-model="searchVlue"
                    placeholder="Search..." @keydown.enter="search($event)"></textarea>
                <button class="btn btn-primary" @click="search($event)">
                    <Icon name="line-md:search" size="24" />
                </button>
            </div>
            <div v-auto-animate id="search-results" class="mt-2 bg-base-100 rounded-lg">
                <!-- {{ searchResults }} -->
                <div v-for="result in searchResults" :key="result._path" class="searchResult rounded-xl border border-transparent p-3 pb-0 hover:bg-base-100/50">
                    <router-link :to="result._path" @click="searchVlue = '';close()"
                        class="m-0 hover:no-underline">
                        <h3 class="text-lg font-bold mt-0">{{ result.title }}</h3>
                        <p class="text-sm">{{ result.description }}</p>
                        <div class="divider m-0 mt-2"></div>
                    </router-link>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.searchResult:hover > a > h3 {
    transition: .2s;
    text-decoration: underline;
}
</style>

