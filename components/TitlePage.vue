<script setup lang="ts">
import type { DocsCollectionItem } from '@nuxt/content';


const props = defineProps<{
    page: DocsCollectionItem
}>();

const getPropsWithDefaults = () => {
    return {
        page: {
            title: props.page?.title || 'Untitled',
            taskNumber: props.page?.protocolAufgabenNr || 'N/A',
            class: props.page?.protocolKlasse || props.page.klasse || 'N/A',
            name: props.page?.protocolName || 'N/A',
            group: props.page?.protocolGruppe  || 'N/A',
            dueDate: props.page?.protocolAbgabetermin || 'N/A',
            submissionDate: props.page?.protocolAbgabedatum || 'N/A',
            description: props.page?.protocolDescription || props.page?.description || 'Keine Beschreibung vorhanden.',
        }
    };
};

</script>

<template>
    <div class="title-page">
        <div class="title-grid text-lg">

            <h1 class="text-3xl font-bold">Titel:</h1>
            <h1 class="text-3xl font-bold">{{ getPropsWithDefaults().page.title }}</h1>

            <div>AufgabeNr:</div>
            <div>{{ getPropsWithDefaults().page.taskNumber }}</div>

            <div>Klasse:</div>
            <div>{{ getPropsWithDefaults().page.class }}</div>

            <div>Name:</div>
            <div>{{ getPropsWithDefaults().page.name }}</div>

            <div>Gruppe:</div>
            <div>{{ getPropsWithDefaults().page.group }}</div>

            <div>Abgabetermin:</div>
            <div>{{ getPropsWithDefaults().page.dueDate }}</div>

            <div>Abgabedatum:</div>
            <div>{{ getPropsWithDefaults().page.submissionDate }}</div>
        </div>

        <div>
            <h2 class="text-2xl no-page-break">Kurzbeschreibung:</h2>
            <p>{{ getPropsWithDefaults().page.description }}</p>
        </div>
    </div>
</template>

<style scoped>
.title-grid {
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5rem 1rem;
    align-items: center;
}
</style>