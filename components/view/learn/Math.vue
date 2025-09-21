<script setup lang="ts">
import type { DocsCollectionItem, MinimarkElement } from '@nuxt/content';

const props = defineProps<{
    page: DocsCollectionItem
}>()

const mathFormulas = computed(() => {
    if (!props.page.body) return [];
    const flat = props.page.body.value
    // get all where the className = 'katex-display'
    const formulars = [];
    for (const node of flat) {
        // if node[1]?.className === 'katex-display'
        let classNames: Array<string> = [];
        if (
            Array.isArray(node) &&
            node[1] &&
            typeof node[1] === 'object' &&
            'className' in node[1] &&
            Array.isArray((node[1] as Record<string, any>).className)
        ) {
            classNames = (node[1] as Record<string, any>).className;
        }
        if (Array.isArray(node) && classNames.includes('katex-display')) {
            formulars.push(node);
        } else {
            // console.log('not a formula', node, node[1]?.className);
        }
    }
    return formulars;
});

const getMathFormula = (el: MinimarkElement): Record<string, any> => {
    // extract the formula from the element
    return {
        body: {
            type: 'minimark',
            value: [el]
        }
    }
    
}

const getMathItems = (el: MinimarkElement): string[] => {
    // extract the items from the formula
    const items: string[] = [];
    if (Array.isArray(el) && el[0] === 'p' && Array.isArray(el[2])) {
        for (const child of el[2]) {
            if (Array.isArray(child) && child[0] === 'mtext') {
                items.push(child[2] as string);
            }
        }
    }
    return items;
}



const currentFormulaIdx = ref(0);


</script>

<template>
    <div>
        <h1>{{ props.page.title }}</h1>
        {{ props.page.body.value.slice(0, 5) }}
        {{ props.page.body.value[5]?.[1] }}
        
        <h2>Math Formulars: </h2>
        <div v-if="mathFormulas.length === 0">No formulas found</div>
        <div v-else>
            <div class="fill-in-formula">
                Formular: 
                <ContentRenderer :value="getMathFormula(mathFormulas[currentFormulaIdx]!)" />
            </div>
            <div>
                Items: 
                <ul>
                    <li v-for="item in getMathItems(mathFormulas[currentFormulaIdx]!)" :key="item">{{ item }}</li>
                </ul>
            </div>
            <!-- {{ mathFormulas[currentFormulaIdx] }} -->
            <div class="flex gap-4 items-center">
                <button class="btn btn-sm" @click="currentFormulaIdx = (currentFormulaIdx - 1 + mathFormulas.length) % mathFormulas.length">Previous</button>
                <span>{{ currentFormulaIdx + 1 }} / {{ mathFormulas.length }}</span>
                <button class="btn btn-sm" @click="currentFormulaIdx = (currentFormulaIdx + 1) % mathFormulas.length">Next</button>
            </div>
        </div>
        <!-- <ContentRenderer :value="testPage" /> -->
    </div>
</template>

<style>

.fill-in-formula {
    border: black 1px solid;
}

.fill-in-formula mtext {
    background-color: black; /* TODO: replace with theme color */
    color: black;
}

</style>