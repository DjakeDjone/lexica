<script setup lang="ts">

const props = defineProps<{
    message: string;
    role: 'user' | 'assistant';
}>();

</script>

<template>
    <div class="" :class="role === 'user' ? 'chat-bubble':''">
        <p v-if="role=='user'">
            {{ message }}
        </p>
        <div v-else class="prose !first:pt-0">
            <span v-html="message"></span>
        </div>
    </div>
</template>