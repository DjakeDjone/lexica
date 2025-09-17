<script setup lang="ts">
import type { DocsCollectionItem } from '@nuxt/content';


const props = defineProps<{
    page: DocsCollectionItem,
    settings?: {

    }
}>();

const pdf = ref<HTMLElement | null>(null);

const downloadPdf = () => {
    if (!pdf.value) return;
    const element = pdf.value;
    
    import('html2pdf.js').then((html2pdf) => {
        const opt = {
            margin:       0.5,
            filename:     (props.page?.title ?? 'document') + '.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf.default().set(opt).from(element).save();
    });
}
</script>


<template>
    <div class="mb-4">
        <button class="btn btn-sm" @click="downloadPdf">Download PDF</button>
    </div>
    <div ref="pdf" class="max-w-2xl">
        <div id="protocol-header" class="flex justify-between items-center mb-8 border-b">
            <div class="text-lg">
                Abteilung für INFORMATIK
            </div>
            <img src="/assets/images/htl-logo.png" alt="HTL Logo" class="h-20 mb-4">
        </div>
        <div class="title-page">
            <h1 class="text-2xl font-bold">{{ page?.title }}</h1>
        </div>
        <TableOfContents :page="page" v-if="page?.generateTableOfContents" />
        <ImagePopupContainer>
            <ContentRenderer v-if="page" :value="page">
            </ContentRenderer>
            <div v-else>
                <p>Loading...</p>
            </div>
        </ImagePopupContainer>
    </div>
</template>