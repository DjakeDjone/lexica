<template>
    <ContentDoc>
        <template #content="{ doc }">
            <div class="prose max-w-none">
                <h1>{{ doc.title }}</h1>
                <nuxt-content :document="doc" />
            </div>
        </template>
        <template #not-found>
            <div class="prose max-w-none">
                <h1>Page not found</h1>
                <p>Sorry, we couldn't find the page you were looking for.</p>
            </div>
        </template>
    </ContentDoc>
</template>