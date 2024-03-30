<script setup lang="ts">
import type { NestedNavItem } from '~/app.vue';


const props = defineProps<{
    navigation: NestedNavItem[]
}>()

const { navigation } = toRefs(props)

const emit = defineEmits()

const closeNav = () => {
    emit('update:navOpen', false)
}

const getNameOfPath = (path: string) => {
    let name = path.split('/').pop();
    name = name ? name : 'Home';
    return name.charAt(0).toUpperCase() + name.slice(1);
}

</script>

<template>
    <ul class="w-full m-0">
        <li v-for="item in navigation" :key="item._path" class="w-full m-0 !bg-transparent">
            <div v-auto-animate v-if="item.children" class="flex flex-col justify-start items-start">
                <h3 @click="item.open = !item.open" class="w-full mt-0">
                    <span>
                        <Icon name="line-md:chevron-down" class="transition-transform duration-150" :class="item.open ? 'transform rotate-180' : ''" size="20">
                        </Icon>
                    </span>
                    {{ getNameOfPath(item._path) }}
                </h3>
                <nested-nav-item v-if="item.open && item.children" @update:navOpen="closeNav()"
                    :navigation="item.children" />
            </div>
            <NuxtLink v-else :to="item._path" @click="closeNav()">{{ item.title }}</NuxtLink>
        </li>
    </ul>
</template>