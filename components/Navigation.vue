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
    <div class="nav-list">
        <slot :navItems="data" />
    </div>
</template>

<style>
.nav-list {
    list-style-type: none;
}

.nav-list li {
    margin: 0.5rem 0;
}

.nav-list a {
    display: block;
    border-radius: 0.25rem;
}

.nav-list a:hover {
    text-decoration: underline;
}

/* any ul inside nav-list */
.nav-list ul {
    list-style-type: none;
    padding-left: 1rem;
}

/* first ul no padding left */
.nav-list > ul {
    padding-left: 0;
}
</style>