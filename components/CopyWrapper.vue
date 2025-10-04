<script setup lang="ts">
const copyWrapperEl = ref<HTMLElement | null>(null);
const copied = ref<string | null>(null);

const initializeCopyButtons = () => {
    if (!copyWrapperEl.value) return;

    // Find all code blocks
    const codeBlocks = copyWrapperEl.value.querySelectorAll('pre');

    codeBlocks.forEach((pre) => {
        // Skip if already has a copy button
        if (pre.querySelector('.copy-button-wrapper')) return;

        // Make pre position relative for absolute positioning of button
        pre.style.position = 'relative';

        // Create wrapper for button
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'copy-button-wrapper';

        // Create copy button
        const button = document.createElement('button');
        button.className = 'btn btn-sm btn-ghost copy-button';
        button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    `;
        button.setAttribute('aria-label', 'Copy code');

        // Add click handler
        button.addEventListener('click', async () => {
            const code = pre.querySelector('code')?.textContent || pre.textContent || '';

            try {
                await navigator.clipboard.writeText(code);
                copied.value = code;

                // Show success state
                button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        `;

                // Reset after 2 seconds
                setTimeout(() => {
                    copied.value = null;
                    button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          `;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });

        buttonWrapper.appendChild(button);
        pre.insertBefore(buttonWrapper, pre.firstChild);
    });
};

onMounted(() => {
    initializeCopyButtons();

    // Watch for content changes
    if (!copyWrapperEl.value) return;

    const observer = new MutationObserver(() => {
        initializeCopyButtons();
    });

    observer.observe(copyWrapperEl.value, {
        childList: true,
        subtree: true,
    });

    // Cleanup observer on unmount
    onUnmounted(() => {
        observer.disconnect();
    });
});
</script>

<template>
    <div ref="copyWrapperEl">
        <slot></slot>
    </div>
</template>

<style scoped>
:deep(.copy-button-wrapper) {
    position: sticky;
    top: 0.5rem;
    right: 0.5rem;
    float: right;
    z-index: 10;
}

:deep(pre) {
    /* padding-right: 3rem; */
    /* position: relative; */
    overflow-x: unset;
}
</style>