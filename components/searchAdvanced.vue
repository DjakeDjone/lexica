<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Fuse, { type FuseResult } from 'fuse.js';



const searchVlue = ref('');

const value = defineModel();
const selected = ref(0);

const emit = defineEmits(['update:close']);
const resultExpaned = ref(false);

const searchInputRef = ref<HTMLInputElement | null>(null);


// Initialize search data
const { data: results, status } = await useFetch('/api/search', {
    method: 'GET',
    query: { q: searchVlue }
});


const close = () => {
    emit('update:close', false);
}

// const aiHandler = useAiHandler();

// const addToContext = (context: string) => {
//     aiHandler.addContext(context);
// }

const handleKeyDown = (e: KeyboardEvent) => {
    if (!results?.value?.results?.length) return;
    if (e.key === 'ArrowDown') {
        selected.value = (selected.value + 1) % results.value.results.length;
        e.preventDefault();
    } else if (e.key === 'ArrowUp') {
        selected.value = (selected.value - 1 + results.value.results.length) % results.value.results.length;
        e.preventDefault();
    } else if (e.key === 'Enter') {
        const result = results.value.results[selected.value];
        if (result) {
            if (e.ctrlKey || e.metaKey) {
                // Open in new tab
                e.preventDefault();
                window.open(`/${result.id}`, '_blank');
            } else {
                // Navigate in current tab
                searchVlue.value = '';
                close();
                useRouter().replace(`/${result.id}`);
            }
        }
    }
    // scroll to selected item
    const resultElements = document.querySelectorAll('.searchResult');
    const selectedElement = resultElements[selected.value] as HTMLElement;
    if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
};

onMounted(() => {
    searchInputRef.value?.focus();
    if (searchInputRef.value) {
        searchInputRef.value.addEventListener('keydown', handleKeyDown);
    }
});

onUnmounted(() => {
    if (searchInputRef.value) {
        searchInputRef.value.removeEventListener('keydown', handleKeyDown);
    }
});

</script>

<template>
    <main class="w-screen h-screen flex justify-center">
        <label @click="close()"
            class="drawer-overlay h-full w-full absolute top-0 left-0 bg-black/10 backdrop-blur-sm"></label>
        <div class="spawn-animation z-[500] p-2 rounded-[.625rem] w-full max-w-2xl mt-[15vh] mb-16">
            <div class="w-full flex items-start gap-2">
                <input type="text" class="input w-full" v-model="searchVlue" placeholder="Type to search..."
                    ref="searchInputRef" />
                <button class="btn btn-square" @click="resultExpaned = !resultExpaned"
                    :title="resultExpaned ? 'Collapse descriptions' : 'Expand descriptions'">
                    <Icon v-if="resultExpaned" name="line-md:menu-fold-left" size="24" />
                    <Icon v-else name="line-md:menu-unfold-left" size="24" />
                </button>
            </div>

            <div id="search-results" class="mt-2 bg-base-100 rounded-lg max-h-full overflow-y-auto">
                <div v-for="result, idx in results?.results" :key="result.id"
                    class="searchResult rounded-lg p-3 pb-0 hover:bg-base-100/50"
                    :style="{ border: selected === idx ? '1px solid var(--color-primary)' : '1px solid transparent', background: selected === idx ? 'var(--color-base-200)' : '' }">

                    <NuxtLink v-auto-animate :to="`/${result.id}`" @click="searchVlue = ''; close()"
                        class="m-0 no-underline">
                        <div class="flex w-full">
                            <div class="w-full">
                                <h3 class="text-lg font-bold mt-0 text-accent">{{ result.title }}</h3>
                                <!-- {{ result.titles }} {{ result.tag ? ' - ' + result.tag : '' }} -->
                                <p v-if="resultExpaned" class="mt-1 text-base-content/80 border-l-2 pl-2 border-base-content/20">
                                    {{ result.description }}
                                </p>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span v-if="result.score !== undefined" class="badge badge-info badge-sm ml-2">
                                    {{ result.score.toFixed(2) }}
                                </span>
                            </div>
                        </div>
                        <span class="text-sm relative">
                            {{ result.url }}
                        </span>
                        <div class="divider m-0"></div>
                    </NuxtLink>
                </div>
                <div v-if="status === 'pending'" class="p-3 text-center text-base-content/60">
                    Loading...
                </div>
                <div v-if="searchVlue.length > 1 && results?.total === 0" class="p-3 text-center text-base-content/60">
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

.spawn-animation {
    animation: spawnAnimation 400ms cubic-bezier(.16,.84,.32,1) both, popIn 320ms cubic-bezier(.2,.9,.3,1) both;
}

@keyframes spawnAnimation {
    0% {
        opacity: 0;
        transform: scale(0.95); 
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes popIn {
    0% {
        opacity: 0;
        transform: translateY(-8px) scale(0.98);
    }
    60% {
        opacity: 1;
        transform: translateY(2px) scale(1.02);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

</style>
