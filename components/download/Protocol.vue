<script setup lang="ts">
import type { DocsCollectionItem } from '@nuxt/content';


const props = defineProps<{
    page: DocsCollectionItem,
    settings?: {

    }
}>();

const pdf = ref<HTMLElement | null>(null);

function printElement(element: HTMLElement) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
        iframeDoc.open();
        // Copy styles from the main document to the iframe
        Array.from(document.styleSheets).forEach(styleSheet => {
            try {
                const rules = styleSheet.cssRules;
                const style = document.createElement('style');
                style.appendChild(document.createTextNode(Array.from(rules).map(rule => rule.cssText).join('\n')));
                iframeDoc.head.appendChild(style);
            } catch (e) {
                console.error('Could not read stylesheet for printing:', e);
            }
        });

        // Add print-specific styles
        const printStyle = document.createElement('style');
        printStyle.textContent = `
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                }
                h1, h2 {
                    page-break-before: always;
                    break-before: page;
                    margin-top: 2rem;
                }
            }
        `;
        iframeDoc.head.appendChild(printStyle);

        iframeDoc.body.innerHTML = element.innerHTML;

        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            document.body.removeChild(iframe);
        }, 500); // A short delay to ensure content and styles are loaded
    } else {
        document.body.removeChild(iframe);
    }
}

const downloadPdf = () => {
    if (pdf.value) {
        printElement(pdf.value);
    }
}

</script>


<template>
    <div class="mb-4">
        <button class="btn btn-sm" @click="downloadPdf">Download PDF</button>
    </div>
    <div ref="pdf" class="max-w-2xl printable">
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

<style>
@media print {

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

    code {
        color: black !important;
        background: gray !important;
    }

    /* extra page for every h2 */
    .printable h1,
    .printable h2 {
        page-break-before: always;
        break-before: page;
        margin-top: 2rem;
    }
}
</style>