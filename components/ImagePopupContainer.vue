<script setup lang="ts">

// get all images in the page

const open = ref(false);
const modalRef = ref<HTMLDialogElement | null>(null);
const activeImageSrc = ref<string | null>(null);
const scale = ref(1);

watch(open, (newValue) => {
    if (!newValue && modalRef.value) {
        modalRef.value.close();
    }
    if (newValue && modalRef.value) {
        modalRef.value.showModal();
    }
});

onMounted(() => {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        img.addEventListener('click', () => {
            open.value = true;
            activeImageSrc.value = img.getAttribute('src');
            const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
            if (dialog) {
                dialog.showModal();
            }
        });
    });
});


</script>

<template>
    <div>
        <button class="btn btn-primary" @click="open = true">Open Modal</button>
        <dialog id="my_modal_1" class="modal" ref="modalRef" @click.self="open = false" @keydown.esc="open = false">
            <button class="btn btn-sm btn-circle absolute right-2 top-2" @click="open = false">✕</button>
            <div class="modal-box !w-[calc(100%-2rem)] h-[calc(100%-2rem)] max-w-5xl">
                <div v-if="activeImageSrc" class="flex flex-col justify-center items-center h-full">
                    <div :class="{ 'cursor-zoom-in': scale > 1, 'cursor-zoom-out': scale <= 1 }">
                        <img :src="activeImageSrc" class="w-full h-full !m-0 !cursor-zoom-in" alt="Image Preview"
                            @click="scale = scale > 1 ? 1 : 2" :style="{ transform: `scale(${scale})` }" />
                    </div>
                    <NuxtLink :to="activeImageSrc" class="btn btn-secondary mt-4" target="_blank"
                        rel="noopener noreferrer">
                        View Full Image
                        <Icon name="line-md:external-link" size="20" />
                    </NuxtLink>
                </div>
                <p v-else>No image selected</p>
            </div>
        </dialog>
        <slot></slot>
    </div>
</template>