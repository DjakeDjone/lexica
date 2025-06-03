<script setup lang="ts">

const { data } = await useAsyncData('navigation', () => {
    return queryCollectionNavigation('docs');
});

</script>


<template>
    <div>
        <!-- {{ data }} -->
        <slot :navItems="data" />
    </div>
</template>