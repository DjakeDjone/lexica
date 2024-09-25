<script setup lang="ts">
import type { Question } from '~/model/quiz';


const props = defineProps<{
    question: string,
    code?: string,
    codeLang?: string,
    answers: string[],
    explanation?: string,
    correct: number | number[]
}>()

const showAnswer = ref(false);
const selected = ref(-1);



</script>


<template>
    <div class="border border-secondary relative p-4 mt-8 w-fit">
        <h3 class="-mt-8 -ml-2 p-0 m-0 bg-base-100 pr-2 w-fit mb-2">{{ question }}</h3>
        <pre v-if="code" class="bg-base-200 p-2 rounded-lg shiki shiki-themes github-light one-dark-pro"
            :class="codeLang ? 'language-' + codeLang : 'language-none'"><code>{{ code }}</code></pre>
        <!-- <p v-if="showAnswer && explanation" class="mb-2 w-full max-w-md border-4 border-primary p-2">
            <span class="relative -top-6 px-2 z-2 bg-base-100">Info!</span> {{ explanation }}
        </p> -->
        <ul class="flex gap-2 flex-col">
            <li v-for="(answer, index) in answers" :key="index" class="flex items-center gap-2 m-0"
                :class="showAnswer ? (correct === index ? 'text-success' : 'text-error') : ''">
                <input type="radio" class="checkbox checkbox-primary" :name="question" :value="index" :id="'A' + index"
                    v-model="selected" :disabled="showAnswer" />
                <!--<label :for="'A' + index">{{ answer }}</label>-->
                <label :for="'A' + index" class="cursor-pointer">
                    <span v-html="answer"></span>
                </label>
            </li>
        </ul>
        <p :class="'opacity-0 ' + (showAnswer ? 'opacity-100' : '')"
            class="mt-4 w-full flex justify-between items-center max-w-md">
            {{ correct === selected ? 'Correct! 🥳🎉' : 'Incorrect 🙁' }}
        </p>
        <button class="btn btn-primary mt-4" v-if="!showAnswer" @click="showAnswer = true">Submit</button>
        <button class="btn btn-primary mt-4" v-else @click="showAnswer = false">Retry</button>
    </div>
</template>