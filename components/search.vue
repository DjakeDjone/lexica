<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Fuse, { type FuseResult } from 'fuse.js';

const searchVlue = ref('');

const value = defineModel();
const selected = ref(0);

const emit = defineEmits(['update:close']);
const searchResults = ref([] as any[]);


// Initialize search data
const { data: searchSections } = await useAsyncData('search-sections', () =>
    queryCollectionSearchSections('docs')
);

const customPages = [
    {
        title: 'Lohnrechner',
        path: '/lohnrechner',
        description: 'Berechnen Sie Ihren Nettolohn',
        content: 'Berechnen Sie Ihren Nettolohn mit unserem Lohnrechner'
    },
    {
        title: 'Impressum',
        path: '/impressum',
        description: 'Impressum',
        content: 'Impressum und rechtliche Informationen'
    },
    {
        title: 'Datenschutz',
        path: '/datenschutz',
        description: 'Datenschutz',
        content: 'Datenschutzerklärung und Informationen zum Datenschutz'
    }
];

// Initialize Fuse.js with search sections and custom pages
const allSearchData = computed(() => [
    ...(searchSections.value || []),
    ...customPages
]);

const fuse = computed(() => new Fuse(allSearchData.value, {
    keys: ['title', 'description', 'content'],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2
}));

const searchEvent = async (e: KeyboardEvent | MouseEvent) => {
    if (e instanceof KeyboardEvent && e.key !== 'Enter') return;
    // SHIFT + ENTER
    if (e instanceof KeyboardEvent && e.shiftKey) return;
    e.preventDefault();
    if (selected.value > 0 && e instanceof KeyboardEvent && e.key === 'Enter') {
        console.log("Selected result:", selected.value, searchResults.value[selected.value]);
        
        const result = searchResults.value[selected.value];
        if (result) {
            useRouter().push(result.id);
            searchVlue.value = '';
            close();
        }
        return;
    }
    await search(searchVlue.value);
}

const search = async (value: string) => {
    value = value.trim();
    if (value.length > 1) {
        // Use Fuse.js for fuzzy search
        const results = fuse.value.search(value).slice(0, 7);
        searchResults.value = results.map(result => ({
            ...result.item,
            score: result.score
        }));

        console.log("Search results:", searchResults.value);
    } else {
        searchResults.value = [];
    }
    selected.value = 0;
}

let searchTimeout: NodeJS.Timeout | null = null;

const searchOnTypeEnd = async (event: KeyboardEvent | FocusEvent) => {
    console.log(event);

    if (event instanceof KeyboardEvent && event.key === 'ArrowUp') {
        if (selected.value > 0) {
            selected.value--;
        }
        return;
    } else if (event instanceof KeyboardEvent && event.key === 'ArrowDown') {
        if (selected.value < searchResults.value.length - 1) {
            selected.value++;
        }
        return;
    } else if (event instanceof KeyboardEvent && event.key === 'Enter') {
        if (searchResults.value.length > 0) {
            const result = searchResults.value[selected.value];
            if (result) {
                await useRouter().push(result._path);
                searchVlue.value = '';
                close();
            }
        }
        return;
    }
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(async () => {
        await search(searchVlue.value);
    }, 300); // Reduced timeout for better UX
}

const searchInputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
    // focus search input
    searchInputRef.value?.focus();
});


const close = () => {
    emit('update:close', false);
}


</script>

<template>
    <main class="w-screen h-screen flex justify-center">
        <label @click="close()"
            class="drawer-overlay h-full w-full absolute top-0 left-0 bg-black/10 backdrop-blur-sm"></label>
        <div class="z-[500] p-2 rounded-[.625rem] w-full max-w-md mt-[15vh]">
            <div class="w-full flex items-start gap-2">
                <input type="text" class="input w-full" v-model="searchVlue" placeholder="Search..."
                    @keydown.enter="searchEvent($event)" @keyup="searchOnTypeEnd($event)"
                    @focus="searchOnTypeEnd($event)" @click="searchOnTypeEnd($event)" ref="searchInputRef" />

                <button class="btn btn-primary" @click="searchEvent($event)">
                    <Icon name="line-md:search" size="24" />
                </button>
            </div>
            <div v-auto-animate id="search-results" class="mt-2 bg-base-100 rounded-lg">
                <div v-for="result, idx in searchResults" :key="result.id"
                    class="searchResult rounded-lg p-3 pb-0 hover:bg-base-100/50"
                    :style="{ border: selected === idx ? '1px solid var(--color-primary)' : '1px solid transparent' }">

                    <NuxtLink :to="result.id" @click="searchVlue = ''; close()" class="m-0 hover:no-underline">
                        <h3 class="text-lg font-bold mt-0">{{ result.title }}</h3>
                        {{ result.content?.slice(0, 100) + '...' }}
                        <div class="divider m-0 mt-2"></div>
                    </NuxtLink>
                </div>
                <div v-if="searchVlue.length > 1 && searchResults.length === 0"
                    class="p-3 text-center text-base-content/60">
                    No results found for "{{ searchVlue }}"
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.searchResult:hover>a>h3 {
    transition: .2s;
    text-decoration: underline;
}
</style>
