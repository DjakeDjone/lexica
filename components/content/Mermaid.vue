<template>
  <div v-if="show" ref="mermaidContainer" class="mermaid bg-white p-4 rounded-lg my-4 overflow-x-auto">
    <slot>{{ code }}</slot>
  </div>
</template>

<script setup lang="ts">
import mermaid from 'mermaid';
import { onMounted, ref, nextTick, watch } from "vue";

const props = defineProps({
  code: {
    type: String,
    default: ''
  }
});

const mermaidContainer = ref<HTMLDivElement | null>(null);
const show = ref(true);

const renderMermaid = async () => {
  if (!mermaidContainer.value) return;
  
  // Use prop code if available, otherwise fallback to slot content
  const graphDefinition = props.code || mermaidContainer.value.textContent?.trim() || '';
  
  if (!graphDefinition) return;
  
  // Clear the container
  mermaidContainer.value.innerHTML = '';
  
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: "forest", 
      securityLevel: 'loose',
    });
    
    const id = `mermaid-svg-${Math.random().toString(36).substring(2)}`;
    const { svg } = await mermaid.render(id, graphDefinition);
    mermaidContainer.value.innerHTML = svg;
  } catch (error) {
    console.error('Mermaid rendering error:', error);
    mermaidContainer.value.innerHTML = `<div class="text-red-500">Error rendering diagram: ${error}</div><pre>${graphDefinition}</pre>`;
  }
};

onMounted(async () => {
  await nextTick();
  await renderMermaid();
});

watch(() => props.code, async () => {
    await nextTick();
    await renderMermaid();
});
</script>