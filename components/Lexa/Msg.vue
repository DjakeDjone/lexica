<script setup lang="ts">

const props = defineProps<{
    message: string;
    thinking?: string;
    role: 'user' | 'system' | 'assistant';
    sources: { title: string; url: string }[] | undefined;
    type?: 'chat' | 'test';
    testData?: any[];
    userAnswers?: any[];
    grading?: any[];
}>();

const emit = defineEmits<{
    (e: 'submit', answers: any[]): void;
}>();

const openedSources = ref(false);
const expandedThinking = ref(false);

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(props.message);
        // notify user
        alert('Copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
};

const openAllSources = () => {
    if (!props.sources) return;
    props.sources.forEach(source => {
        window.open(source.url, '_blank', 'noopener,noreferrer');
    });
    // Focus back to the current window
    window.focus();
};

</script>

<template>
    <div :class="role === 'user' ? 'chat-bubble' : ''">
        <p v-if="role == 'user'">
            {{ message }}
        </p>
        <div v-else class="prose !first:pt-0">
            <LexaTest v-if="type === 'test' && testData" :questions="testData" :userAnswers="userAnswers"
                :grading="grading" @submit="emit('submit', $event)" />
            <div v-else>
                <div>
                    <div @click="expandedThinking = !expandedThinking">
                        <strong class="opacity-70">
                            <Icon name="emojione-monotone:thinking-face" /> Thinking
                        </strong>
                        <button v-if="thinking" class="cursor-pointer">
                            <Icon name="line-md:arrow-down" size="15" class="inline-block ml-2 transition-transform"
                                :class="{ 'rotate-180': expandedThinking }" />
                        </button>
                    </div>
                    <p v-if="thinking && expandedThinking" class="italic text-gray-500 mb-2">{{ thinking }}</p>
                </div>
                <div class="ai-message">
                    <div v-html="message"></div>
                </div>
            </div>
        </div>

        <div v-if="sources && sources.length">
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

        <div id="actions" class="group *:group-hover:opacity-85 *:opacity-50 *:hover:opacity-100
           w-fit gap-2 mt-2">
            <slot name="actions" />
            <!-- copy -->
            <button class="btn btn-xs btn-ghost" @click="copyToClipboard">
                <Icon name="mdi:content-copy" class="inline-block mr-1" />
                Copy
            </button>
            <button v-if="sources && sources.length" class="btn btn-xs btn-ghost" @click="openAllSources">
                <Icon name="mdi:open-in-new" class="inline-block mr-1" />
                Open All Sources
            </button>
        </div>
    </div>
</template>

<style>
.ai-message div:first-child {
    padding-top: 0 !important;
    margin-top: 0 !important;
}
</style>