<script setup lang="ts">

const props = defineProps<{
    link: string;
}>();

</script>
<template>
    <a
        :href="link"
        class="btn btn-primary"
        download
    >
        <slot>Download</slot>
    </a>
</template>