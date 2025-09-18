<script setup lang="ts">

const emit = defineEmits<{
    (e: 'update:select', value: string): void;
}>();

const suggestions = {
    technical: [
        "Was ist tcp?",
        "Erkläre den Unterschied zwischen HTTP und HTTPS",
        "Erkläre Mean, Median und Modus",
        "Erkläre die 3-Schema Datenbankarchitektur",
        "Erkläre das Spanning Tree Protocol",
    ],
    school: [
        "Wer war Ursula Poznanski?",
        "Was ist der Unterschied zwischen einem Krimi und einer Detektivgeschichte?",
        "Was ist ein Meilenstein?"
    ],
    linux: [
        "Wie installiere ich Software unter Garuda Linux?",
        "Wie installiere ich python unter NixOS?",
        "Wie installiere ich Software unter Ubuntu?",
        "Wie installiere ich die fish shell auf Ubuntu?",
    ]
}

type SuggestionCategory = keyof typeof suggestions;

const selectedCategory = ref<SuggestionCategory | null>('technical');

const selectSuggestion = (suggestion: string) => {
    emit('update:select', suggestion);
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
            <ul>
                <li v-for="(suggestion, index) in suggestions![selectedCategory]" :key="index">
                    <button class="btn btn-ghost" @click="selectSuggestion(suggestion)">
                        {{ suggestion }}
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>