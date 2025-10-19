<template>
  <div ref="mermaidContainer" class="mermaid">
      <slot></slot>
  </div>
</template>

<script setup lang="ts">
import mermaid from 'mermaid';
import { onMounted, ref } from "vue";

const mermaidContainer = ref<HTMLPreElement | null>(null);

onMounted(async () => {
  if (mermaidContainer.value) {
    console.log("Mermaid container found:", mermaidContainer.value.innerHTML);
    const graphDefinition = mermaidContainer.value.textContent?.trim() ?? '';
    mermaidContainer.value.innerHTML = ''; // Clear the container
    console.log("Rendering Mermaid diagram:", graphDefinition);
    if (graphDefinition) {
        mermaid.initialize({
            startOnLoad: false,
            theme: "forest",
        });
        const id = `mermaid-svg-${Math.random().toString(36).substring(2)}`;
        const { svg } = await mermaid.render(id, graphDefinition);
        mermaidContainer.value.innerHTML = svg;
    }
  }
});
</script>