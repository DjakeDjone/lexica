<template>
  <Mermaid v-if="language === 'mermaid'" :code="code" />
  <pre v-else :class="$props.class"><slot /></pre>
</template>

<script setup lang="ts">
// Override default ProsePre to intercept mermaid code blocks
defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array as () => number[],
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})
</script>
