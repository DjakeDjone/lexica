<script setup lang="ts">

import type { SearchResult } from '~/server/utils/search';

const emit = defineEmits<{
    (e: 'update:select', value: { text: string, mode: 'test' | 'rag', context: SearchResult[] }): void;
}>();

const suggestions = {
    technical: {
        test: [
            {
                text: "Test my knowledge on TCP",
                context: [{ id: "/summarized/nscs/1-tcp", title: "TCP", url: "/summarized/nscs/1-tcp", titles: ["TCP"], level: 1, score: 1, content: "", description: "" }]
            },
            {
                text: "Quiz me on HTTP vs HTTPS",
                context: [{ id: "/summarized/nscs/0-iso-osi-schichtenmodell", title: "OSI Model & Protocols", url: "/summarized/nscs/0-iso-osi-schichtenmodell", titles: ["OSI Model"], level: 1, score: 1, content: "", description: "" }]
            }
        ],
        rag: [
            {
                text: "What is TCP?",
                context: [{ id: "/summarized/nscs/1-tcp", title: "TCP", url: "/summarized/nscs/1-tcp", titles: ["TCP"], level: 1, score: 1, content: "", description: "" }]
            },
            {
                text: "Explain the difference between HTTP and HTTPS",
                context: [{ id: "/summarized/nscs/0-iso-osi-schichtenmodell", title: "OSI Model & Protocols", url: "/summarized/nscs/0-iso-osi-schichtenmodell", titles: ["OSI Model"], level: 1, score: 1, content: "", description: "" }]
            },
            {
                text: "Explain the 3-Schema database architecture",
                context: [{ id: "/school/dbi/db_allgemeines", title: "Database Basics", url: "/school/dbi/db_allgemeines", titles: ["Database Basics"], level: 1, score: 1, content: "", description: "" }]
            }
        ]
    },
    school: {
        test: [
            {
                text: "Test my knowledge on Ursula Poznanski",
                context: [{ id: "/school/deutsch/ursula_poznsnski", title: "Ursula Poznanski", url: "/school/deutsch/ursula_poznsnski", titles: ["Ursula Poznanski"], level: 1, score: 1, content: "", description: "" }]
            },
            {
                text: "Quiz me on crime thrillers vs detective stories",
                context: [{ id: "/school/deutsch/krimi_vs_detektivroman", title: "Krimi vs Detektivroman", url: "/school/deutsch/krimi_vs_detektivroman", titles: ["Krimi vs Detektivroman"], level: 1, score: 1, content: "", description: "" }]
            }
        ],
        rag: [
            {
                text: "Who was Ursula Poznanski?",
                context: [{ id: "/school/deutsch/ursula_poznsnski", title: "Ursula Poznanski", url: "/school/deutsch/ursula_poznsnski", titles: ["Ursula Poznanski"], level: 1, score: 1, content: "", description: "" }]
            },
            {
                text: "What is the difference between a thriller and a detective story?",
                context: [{ id: "/school/deutsch/krimi_vs_detektivroman", title: "Krimi vs Detektivroman", url: "/school/deutsch/krimi_vs_detektivroman", titles: ["Krimi vs Detektivroman"], level: 1, score: 1, content: "", description: "" }]
            },
            {
                text: "What are rhetorical devices?",
                context: [{ id: "/school/deutsch/rethorische-stilmittel", title: "Rhetorical Devices", url: "/school/deutsch/rethorische-stilmittel", titles: ["Rhetorical Devices"], level: 1, score: 1, content: "", description: "" }]
            }
        ]
    },
    linux: {
        test: [
            {
                text: "Test my knowledge on installing software on Garuda Linux",
                context: [{ id: "/dev/linux/garuda", title: "Garuda Linux", url: "/dev/linux/garuda", titles: ["Garuda Linux"], level: 1, score: 1, content: "", description: "" }]
            },
            {
                text: "Quiz me on installing Python on NixOS",
                context: [{ id: "/dev/linux/distro_hopping/distro-hopping", title: "Distro Hopping", url: "/dev/linux/distro_hopping/distro-hopping", titles: ["Distro Hopping"], level: 1, score: 1, content: "", description: "" }]
            }
        ],
        rag: [
            {
                text: "How do I install software on Garuda Linux?",
                context: [{ id: "/dev/linux/garuda", title: "Garuda Linux", url: "/dev/linux/garuda", titles: ["Garuda Linux"], level: 1, score: 1, content: "", description: "" }]
            },
            {
                text: "How do I install python on NixOS?",
                context: [{ id: "/dev/linux/distro_hopping/distro-hopping", title: "Distro Hopping", url: "/dev/linux/distro_hopping/distro-hopping", titles: ["Distro Hopping"], level: 1, score: 1, content: "", description: "" }]
            },
            {
                text: "How do I install the fish shell on Ubuntu?",
                context: [{ id: "/dev/linux/ubuntu", title: "Ubuntu", url: "/dev/linux/ubuntu", titles: ["Ubuntu"], level: 1, score: 1, content: "", description: "" }]
            }
        ]
    }
}

type SuggestionCategory = keyof typeof suggestions;

const selectedCategory = ref<SuggestionCategory | null>('technical');

const selectSuggestion = (suggestion: { text: string, context: SearchResult[] }, mode: 'test' | 'rag') => {
    emit('update:select', { text: suggestion.text, mode, context: suggestion.context });
}

const sellectSuggestion = (suggestion: string) => {
    if (selectedCategory.value === suggestion) {
        selectedCategory.value = null;
    } else {
        selectedCategory.value = suggestion as SuggestionCategory;
    }
}

</script>

<template>
    <div class="py-8">
        <h1 class="text-3xl font-bold">
            Welcome to Lexa,
        </h1>
        <h2 class="text-2xl mb-6">
            the Master of my library!
        </h2>
        <div class="flex flex-wrap gap-2 mb-4">
            <button v-for="category in Object.keys(suggestions)" :key="category" class="btn rounded-full"
                :class="{ 'btn-primary': selectedCategory === category }" @click="sellectSuggestion(category);">
                {{ category.charAt(0).toUpperCase() + category.slice(1) }}
            </button>
        </div>
        <div v-if="selectedCategory" class="max-w-none">
            <!-- <h3 class="text-xl font-semibold mb-2">{{ selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1) }} Suggestions</h3> -->
            <div class="flex flex-col gap-6">
                <ul class="flex flex-col gap-1 w-fit">
                    <li v-for="(suggestion, index) in suggestions[selectedCategory].test" :key="'test-' + index"
                        class="w-fit">
                        <button
                            class="btn btn-ghost btn-sm w-full justify-start text-start font-normal normal-case h-auto py-2"
                            @click="selectSuggestion(suggestion, 'test')">
                            <Icon name="mdi:school" class="w-4 h-4" />
                            {{ suggestion.text }}
                        </button>
                    </li>
                    <div class="w-full mx-4 my-2 border-t border-gray-200/20"></div>
                    <li v-for="(suggestion, index) in suggestions[selectedCategory].rag" :key="'rag-' + index"
                        class="w-fit">
                        <button class=" btn btn-ghost btn-sm w-full justify-start text-start font-normal normal-case
                            w-fit h-auto py-2" @click="selectSuggestion(suggestion, 'rag')">
                            <Icon name="mdi:robot" class="w-4 h-4" />
                            {{ suggestion.text }}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>