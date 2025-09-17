<script setup lang="ts">


const route = useRoute();
const router = useRouter();

const searchQuery = ref(route.query.q as string || '');

watch(searchQuery, (newValue) => {
    router.replace({ query: { q: newValue } });
});

const { data: results, status } = await useFetch('/api/search', {
    method: 'GET',
    query: { q: searchQuery }
});


</script>

<template>
    <div class="p-4">
        <div class="mb-8 flex flex-col">
            <input v-model="searchQuery" type="text" placeholder="Search..." class="w-full max-w-md p-2 input" />
            <div :class="{
                'hidden': results?.results.length === 0 && status !== 'pending',
                'bg-green-100 text-green-800': status === 'success',
                'bg-red-100 text-red-800': status === 'error',
                'bg-yellow-100 text-yellow-800': status === 'pending'
            }" class="p-1 badge badge-dash opacity-85 mt-2">
                {{ results?.total }} Results
            </div>
        </div>


        <div v-if="status === 'pending'">
            <ul class="flex flex-col gap-4">
                <li v-for="result in 6" :key="result" class="mb-2 flex flex-col gap-2">
                    <a class="text-blue-600 hover:underline skeleton h-6 w-full max-w-[15rem]"></a>
                    <p v-if="result % 3 == 0" class="text-sm text-gray-600 skeleton h-5 max-w-sm"></p>
                    <p v-if="result % 2 == 0" class="text-sm text-gray-600 skeleton h-5 max-w-[30rem]"></p>
                    <p class="text-sm text-gray-600 skeleton h-8 max-w-[12rem]"></p>
                </li>
            </ul>
        </div>
        <div v-if="results && results.results.length">
            <ul>
                <li v-for="result in results.results" :key="result.id" class="mb-2">
                    <a :href="result.id" class="text-blue-600 hover:underline">{{ result.title }}</a>
                    <p class="text-sm text-gray-600">{{ result.description }}</p>
                </li>
            </ul>
        </div>
        <div v-else-if="status === 'error'" class="text-center text-red-600 page">Error loading results.</div>
        <div v-else-if="searchQuery.length > 0 && results && results.results.length === 0" class="text-center page">No
            results found.</div>
    </div>
</template>

<style scoped>
.page {
    min-height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>