<script setup lang="ts">

const { data } = await useAsyncData('navigation', () => {
    return queryCollectionNavigation('docs');
}, {
    transform: (data) => {
        data.forEach(item => {
            item.open = false;
        });
        return data;
    }
});

</script>


<template>
    <div>
        <slot :navItems="data" />
    </div>
</template>