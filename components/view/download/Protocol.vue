<script setup lang="ts">
import type { DocsCollectionItem } from '@nuxt/content';


const props = defineProps<{
    page: DocsCollectionItem,
    settings?: {
    }
}>();

const settings = ref({
    genTableOfContents: props.page?.generateTableOfContents ?? true,
    // other settings can be added here
});

const pdf = ref<HTMLElement | null>(null);


const downloadPdf = () => {
    if (pdf.value) {
        window.print();
        // printElement(pdf.value);

    }
}

</script>


<template>
    <div class="mt-2 flex gap-2">
        <button class="btn btn-sm" @click="downloadPdf">Download PDF</button>
        <!-- switch -->
        <div>
            <button class="btn btn-sm" @click="settings.genTableOfContents = !settings.genTableOfContents">
                {{ settings?.genTableOfContents ? 'Hide' : 'Show' }} Table of Contents
            </button>
        </div>
    </div>
    <div ref="pdf" class="max-w-2xl printable">
        <div id="protocol-header" class="flex justify-between items-center mb-8 border-b">
            <div class="text-lg font-semibold">
                Abteilung für INFORMATIK
            </div>
            <img src="/images/assets_images_htl-logo.png" alt="HTL Logo" class="h-16">
        </div>
        <!-- <div class="header flex justify-between items-center mb-8">
            <span>
                Abteilung für INFORMATIK
            </span>
        </div> -->
        <div id="printable-content">
            <TitlePage :page="page" />
            <TableOfContents v-if="settings.genTableOfContents" :page="page" />
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
html {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

@media print {

    /* new page after hr */
    hr {
        page-break-after: always;
        border: none;
        margin: 0;
        padding: 0;
    }

    @page {
        padding: 20mm;
        size: A4;
    }

    body {
        margin: 0;
        /* place for the header */
        /* padding: 20mm 15mm 15mm 15mm; */
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        color: #000 !important;
    }

    /* for every h2 a new page (except for '.no-page-break') */
    /* h2:not(.no-page-break) {
        page-break-before: always;
    } */
    /* table of contents and h2 after table of contents */
    .table-of-contents,
    .table-of-contents+* {
        page-break-before: always;
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

    .pre {
        background-color: #545454 !important;
    }

    .copy-button-wrapper {
        display: none !important;
    }
}
</style>