<script setup lang="ts">
import { convertMdToHtml } from './mdHelper';

const content = ref<string>('# Hello World');
const editableDiv = ref<HTMLElement | null>(null);

// watch(content, (newContent) => {    
//     if (editableDiv.value) {
//         editableDiv.value.innerHTML = convertMdToHtml(newContent);
//     }
// });

const updateContent = () => {
    if (editableDiv.value) {
        content.value = editableDiv.value.innerText;
    }
};


</script>

<template>
    <div class="border">
        {{ content }}
    </div>
    <div class="prose" @input.debounce="updateContent">
        <div ref="editableDiv" contenteditable="true"></div>
    </div>
</template>