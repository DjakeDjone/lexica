<script setup lang="ts">

const props = defineProps<{
    message: string;
}>();

</script>

<template>
    <div class="message">
        <p class="prose">
            <span v-html="message"></span>
        </p>
    </div>
</template>