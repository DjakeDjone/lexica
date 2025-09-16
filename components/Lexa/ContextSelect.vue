<script setup lang="ts">

const selectedContext = defineModel<SearchResult[]>();
const showSelect = ref(false);
const showHoveredContext = ref(false);

const searchWord = ref('');
const { data: searchResults } = useFetch('/api/search', {
    method: 'GET',
    query: { q: searchWord },
    transform: (data) => {
        // add a selected property to each result
        const transformedResults = data.results.map((result) => ({
            ...result,
            selected: selectedContext.value?.includes(result) ?? false,
        }));
        return { ...data, results: transformedResults };
    }
});

const addToContext = (context: SearchResult) => {
    if (!selectedContext.value) {
        selectedContext.value = [];
    }
    if (!selectedContext.value.includes(context)) {
        selectedContext.value.push(context);
    }
};

const removeFromContext = (context: SearchResult) => {
    if (!selectedContext.value) return;
    selectedContext.value = selectedContext.value.filter(c => c !== context);
};

</script>

<template>
    <div v-if="showSelect" class="absolute bottom-16 bg-base-100 p-4 rounded shadow-lg flex flex-col gap-2">
        <h3 class="font-semibold">Select Context
            <button class="btn btn-xs btn-ghost float-right" @click="showSelect = false">
                <Icon name="mdi:close" class="inline-block" />
            </button>
        </h3>
        <input type="text" v-model="searchWord" placeholder="Search context..." class="input w-full mb-2" />
        <div class="max-h-60 flex gap-2">
            <div v-if="searchResults && searchResults.results.length" class="max-h-60 w-52 overflow-y-auto">
                <div v-for="(result, index) in searchResults.results" :key="index"
                    class="p-2 rounded cursor-pointer hover:bg-base-200 flex justify-between items-center"
                    :class="result.selected ? 'bg-base-200 border border-primary' : 'border border-transparent'" @click="{
                        if (result.selected) {
                            selectedContext = selectedContext?.filter(c => c !== result);
                        } else {
                            selectedContext = [...(selectedContext || []), result];
                        }
                        result.selected = !result.selected;
                    }">
                    <div>
                        <h4 class="font-semibold">{{ result.title }}</h4>
                        <p class="text-sm text-gray-500">{{ result.titles }} {{ result.tag ? ' - ' + result.tag : '' }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="max-h-60 overflow-y-auto">
                <p class="text-sm text-gray-500">Selected Contexts:</p>
                <ul class="flex flex-col gap-2">
                    <li v-for="context in selectedContext" :key="context.id" class="w-full">
                        <div class="flex items-center justify-between gap-2 w-full">
                            <span>{{ context.title }}</span>
                            <button class="btn btn-xs btn-outline btn-error" @click="removeFromContext(context)">
                                <Icon name="mdi:close" class="inline-block" />
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div v-if="showHoveredContext && !showSelect" id="hover-context"
        class="absolute bottom-16 bg-base-100 p-4 rounded shadow-lg flex flex-col gap-2">
        <p class="text-sm text-gray-500">Selected Contexts:</p>
        <ul class="flex flex-col gap-2">
            <li v-for="context in selectedContext" :key="context.id" class="w-full">
                <div class="flex items-center justify-between gap-2 w-full">
                    <span>{{ context.title }}</span>
                </div>
            </li>
        </ul>
    </div>
    <button class="btn btn-sm rounded-full" @click="showSelect = !showSelect" @mouseover="showHoveredContext = true"
        @mouseleave="showHoveredContext = false">
        <Icon name="mdi:database" class="inline-block" />
        context ({{ selectedContext?.length || 0 }})
    </button>
</template>