<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';


const props = defineProps<{
    navigation: ContentNavigationItem[]
}>()

const navigation = ref(JSON.parse(JSON.stringify(props.navigation)))

const emit = defineEmits()

const closeNav = () => {
    emit('update:navOpen', false)
}

const getNameOfPath = (path: string) => {
    let name = path.split('/').pop();
    name = name ? name : 'Home';
    return name.charAt(0).toUpperCase() + name.slice(1);
}

const toggleOpen = (item: ContentNavigationItem) => {
    item.open = !item.open;
}

</script>

<template>
    <ul class="w-full m-0">
        <li v-for="item in navigation" :key="item.path" class="w-full m-0 !bg-transparent">
            <div v-if="item.children" class="flex flex-col justify-start items-start">
                <div @click="toggleOpen(item)" class="w-full mt-0">
                    <span>
                        <Icon name="line-md:chevron-down" class="-mb-1 transition-transform duration-150"
                            :class="item.open ? 'transform rotate-180' : ''" size="15">
                        </Icon>
                    </span>
                    {{ getNameOfPath(item.path) }}
                </div>
                <NestedNavItem v-if="item.open && item.children" @update:navOpen="closeNav()"
                    :navigation="item.children" />
            </div>
            <NuxtLink v-else :to="item.path" @click="closeNav()">{{ item.title }}</NuxtLink>
        </li>
    </ul>
</template>