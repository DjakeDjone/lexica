<script setup lang="ts">

const props = defineProps<{
    message: string;
    role: 'user' | 'system' | 'assistant';
    sources: { title: string; url: string }[] | undefined;
}>();

const openedSources = ref(false);

</script>

<template>
    <div class="" :class="role === 'user' ? 'chat-bubble' : ''">
        <p v-if="role == 'user'">
            {{ message }}
        </p>
        <div v-else class="prose !first:pt-0">
            <span v-html="message"></span>
        </div>

        <div v-if="sources && sources.length" class="mt-4">
            <div class="flex items-center mb-2 gap-4">
                <h3 class="font-semibold mb-2">Sources:</h3>
                <button class="cursor-pointer" @click="openedSources = !openedSources">
                    <Icon v-if="!openedSources" name="line-md:arrow-down-circle" size="20" class="inline-block mr-2" />
                    <Icon v-else name="line-md:arrow-up-circle" size="20" class="inline-block mr-2" />
                </button>
            </div>
            <ul v-if="openedSources" class="flex gap-2 flex-wrap">
                <li v-for="(source, index) in sources" :key="index">
                    <a :href="source.url" target="_blank" rel="noopener" class="text-blue-600 hover:underline">
                        <Icon name="mdi:document" class="inline-block mr-1" />
                        {{ source.title }}
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>