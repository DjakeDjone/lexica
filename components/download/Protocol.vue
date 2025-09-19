<script setup lang="ts">
import type { DocsCollectionItem } from '@nuxt/content';


const props = defineProps<{
    page: DocsCollectionItem,
    settings?: {
    }
}>();


const pdf = ref<HTMLElement | null>(null);


const downloadPdf = () => {
    if (pdf.value) {
        window.print();
        // printElement(pdf.value);

    }
}

</script>


<template>
    <div class="mb-4">
        <button class="btn btn-sm" @click="downloadPdf">Download PDF</button>
    </div>
    <div ref="pdf" class="max-w-2xl printable">
        <!-- <div id="protocol-header" class="flex justify-between items-center mb-8">
            <div class="text-lg font-semibold">
                Abteilung für INFORMATIK
            </div>
            <img src="/assets/images/htl-logo.png" alt="HTL Logo" class="h-16">
        </div> -->
        <div class="header flex justify-between items-center mb-8">
            <span>
                Abteilung für INFORMATIK
            </span>
        </div>
        <div id="printable-content">
            <div class="title-page">
                <h1 class="text-4xl font-bold">{{ page?.title }}</h1>
                <p class="text-lg mt-4">{{ page?.description }}</p>
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
    </div>
</template>

<style>
@media print {

    /* new page after hr */
    hr {
        page-break-after: always;
        border: none;
        margin: 0;
        padding: 0;
    }

    .header {
        position: fixed;
        top: 0rem;
        left: 0;
        right: 0;
        width: 100%;
        background: white;
        padding: 10px 0;
        border-bottom: 1px solid #ccc;
    }

    @page {
        margin: 0;
        size: A4;
    }

    body {
        margin: 0;
        padding: 20mm;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
    }

    .modal {
        display: none;
    }

    body * {
        visibility: hidden;
    }

    .printable,
    .printable * {
        visibility: visible !important;
    }

    .printable {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
}
</style>