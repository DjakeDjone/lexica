<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';


const props = defineProps<{
    navigation: ContentNavigationItem[]
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
        <!-- {{ navigation }} -->
        <li v-for="item in navigation" :key="item.path" class="w-full m-0 !bg-transparent">
            <div v-if="item.children" class="flex flex-col justify-start items-start">
                <h3 @click="item.open = !item.open" class="w-full mt-0">
                    <span>
                        <Icon name="line-md:chevron-down" class="-mb-1 transition-transform duration-150"
                            :class="item.open ? 'transform rotate-180' : ''" size="15">
                        </Icon>
                    </span>
                    {{ getNameOfPath(item.path) }}
                </h3>
                <nested-nav-item v-if="item.open && item.children" @update:navOpen="closeNav()"
                    :navigation="item.children" />
            </div>
            <NuxtLink v-else :to="item.path" @click="closeNav()">{{ item.title }}</NuxtLink>
        </li>
    </ul>
</template>