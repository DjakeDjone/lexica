<script setup lang="ts">
import { onClickOutside, useDebounceFn } from '@vueuse/core';

const selectedContext = defineModel<SearchResult[]>();
const showSelect = ref(false);
const showHoveredContext = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

const contextSelectEl = useTemplateRef<HTMLElement>('contextSelectEl');

onClickOutside(contextSelectEl, () => {
    showSelect.value = false;
});

const searchWord = ref('');
const searchResults = ref<{ results: (SearchResult & { selected: boolean })[] } | null>(null);
const isLoading = ref(false);

const performSearch = useDebounceFn(async (query: string) => {
    if (!query.trim()) {
        searchResults.value = null;
        return;
    }

    isLoading.value = true;
    try {
        const data = await $fetch('/api/search', {
            method: 'GET',
            query: { q: query, pageSize: 50 },
        });

        const fileMap = new Map<string, SearchResult>();

        data.results.forEach((result) => {
            if (!result.id) return;

            const basePath = result.id.split('#')[0] || result.id;
            const baseUrl = result.url.split('#')[0] || result.url;

            if (basePath && !fileMap.has(basePath)) {
                fileMap.set(basePath, {
                    ...result,
                    id: basePath,
                    url: baseUrl,
                    title: result.titles?.[0] || result.title,
                });
            }
        });

        const fileResults = Array.from(fileMap.values()).map((result) => ({
            ...result,
            selected: selectedContext.value?.some(c => c.id === result.id) ?? false,
        }));

        searchResults.value = { results: fileResults };
    } catch (error) {
        console.error('Search error:', error);
        searchResults.value = null;
    } finally {
        isLoading.value = false;
    }
}, 300);

watch(searchWord, (newVal) => {
    if (!newVal.trim()) {
        searchResults.value = null;
        isLoading.value = false;
    } else {
        isLoading.value = true;
        performSearch(newVal);
    }
});

const toggleSelection = (result: SearchResult & { selected: boolean }) => {
    if (result.selected) {
        selectedContext.value = selectedContext.value?.filter(c => c.id !== result.id);
    } else {
        selectedContext.value = [...(selectedContext.value || []), result];
    }
    result.selected = !result.selected;
};

const removeFromContext = (context: SearchResult) => {
    if (!selectedContext.value) return;
    selectedContext.value = selectedContext.value.filter(c => c.id !== context.id);
    if (searchResults.value?.results) {
        const found = searchResults.value.results.find(r => r.id === context.id);
        if (found) found.selected = false;
    }
};

const clearAllContext = () => {
    selectedContext.value = [];
    if (searchResults.value?.results) {
        searchResults.value.results.forEach(r => r.selected = false);
    }
};

watch(showSelect, (newVal) => {
    if (newVal) {
        nextTick(() => {
            searchInput.value?.focus();
        });
    }
});
</script>

<template>
    <div v-if="showSelect" ref="contextSelectEl" @keydown.enter="showSelect = false"
        class="absolute bottom-14 left-2 right-2 sm:right-0 sm:left-auto card bg-base-200/95 backdrop-blur-md shadow-xl w-auto sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div class="card-body p-4 gap-3">
            <div class="flex items-center justify-between">
                <h3 class="card-title text-base">
                    <Icon name="mdi:file-document-multiple" class="text-primary" />
                    Select Files
                </h3>
                <button class="btn btn-ghost btn-xs btn-circle" @click="showSelect = false">
                    <Icon name="mdi:close" class="text-lg" />
                </button>
            </div>

            <div class="relative">
                <input ref="searchInput" type="text" v-model="searchWord" placeholder="Search files..."
                    class="input input-sm w-full pl-9" />
                <Icon v-if="!isLoading" name="mdi:magnify"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <span v-else class="loading loading-spinner loading-xs absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div v-if="selectedContext?.length" class="flex flex-wrap gap-1.5" v-auto-animate>
                <span v-for="context in selectedContext" :key="context.id"
                    class="badge badge-primary badge-sm gap-1 pr-1">
                    <span class="max-w-24 truncate">{{ context.title }}</span>
                    <button class="btn btn-ghost btn-xs btn-circle size-4" @click="removeFromContext(context)">
                        <Icon name="mdi:close" class="text-xs" />
                    </button>
                </span>
                <button v-if="selectedContext.length > 1"
                    class="badge badge-ghost badge-sm gap-1 cursor-pointer hover:badge-error transition-colors"
                    @click="clearAllContext">
                    Clear all
                </button>
            </div>

            <div class="divider my-0" />

            <div class="max-h-52 overflow-y-auto -mx-2 px-2">
                <div v-if="!searchWord" class="text-center py-6 text-base-content/60">
                    <Icon name="mdi:file-search" class="text-3xl mb-2" />
                    <p class="text-sm">Type to search for files</p>
                </div>

                <div v-else-if="isLoading" class="flex justify-center py-6">
                    <span class="loading loading-spinner loading-md text-primary" />
                </div>

                <div v-else-if="searchResults && searchResults.results.length === 0"
                    class="text-center py-6 text-base-content/60">
                    <Icon name="mdi:file-remove" class="text-3xl mb-2" />
                    <p class="text-sm">No files found</p>
                </div>

                <ul v-else-if="searchResults?.results.length" class="menu menu-sm p-0 gap-1">
                    <li v-for="result in searchResults.results" :key="result.id">
                        <label class="flex items-start gap-3 py-2 px-3 rounded-lg cursor-pointer hover:bg-base-300/50"
                            :class="result.selected ? 'bg-primary/10 border border-primary/30' : 'border border-transparent'">
                            <input type="checkbox" class="checkbox checkbox-primary checkbox-sm mt-0.5"
                                :checked="result.selected" @change="toggleSelection(result)" />
                            <div class="flex-1 min-w-0">
                                <p class="font-medium text-sm truncate">{{ result.title }}</p>
                                <p class="text-xs text-base-content/60 truncate">
                                    {{ result.titles?.join(' › ') || result.id }}
                                </p>
                            </div>
                            <Icon name="mdi:file-document-outline" class="text-base-content/40 shrink-0" />
                        </label>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div v-if="showHoveredContext && !showSelect && selectedContext?.length"
        class="absolute bottom-14 left-0 card bg-base-200/95 backdrop-blur-md shadow-lg p-3 min-w-48 max-w-64 z-40">
        <p class="font-semibold text-sm mb-2 flex items-center gap-1.5">
            <Icon name="mdi:file-document-multiple" class="text-primary" />
            Selected Files ({{ selectedContext.length }})
        </p>
        <ul class="text-sm space-y-1">
            <li v-for="context in selectedContext" :key="context.id" class="truncate text-base-content/80">
                • {{ context.title }}
            </li>
        </ul>
    </div>

    <button class="btn btn-sm btn-ghost gap-1.5" :class="selectedContext?.length ? 'text-primary' : ''"
        @click="showSelect = !showSelect" @mouseover="showHoveredContext = true"
        @mouseleave="showHoveredContext = false">
        <Icon name="mdi:file-document-multiple" />
        <span class="hidden sm:inline">Context</span>
        <span v-if="selectedContext?.length" class="badge badge-primary badge-xs">
            {{ selectedContext.length }}
        </span>
    </button>
</template>