<script setup lang="ts">

export type NavItem = {
  title: string
  _path: string
}

export type NestedNavItem = NavItem & {
  children?: NestedNavItem[],
  open?: boolean
}


const navOpen = ref(false)



</script>


<template>
  <div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" v-model="navOpen" />
    <div class="drawer-content">
      <!-- Page content here -->
      <ContentDoc v-slot="{ doc }">
        <div class="flex items-center p-4">
          <label for="my-drawer" class="btn btn-primary drawer-button">
            <Icon name="line-md:menu-unfold-right" size="30"></Icon>
          </label>
          <h1 class="text-2xl text-bold ml-8 w-full">
            <NuxtLink to="/">Home</NuxtLink>/<NuxtLink v-for="part, i in doc._path.split('/').slice(1) " :key="part"
              :to="doc._path.split('/').slice(0, i + 2).join('/')">
              {{ part }}/</NuxtLink>
          </h1>
        </div>
        <section class="p-4">
          <ContentRenderer :value="doc" />
        </section>
      </ContentDoc>
    </div>
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul v-auto-animate class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <ContentNavigation v-slot="{ navigation }">
          <nested-nav-item @update:navOpen="navOpen = false" :navigation="navigation" />
        </ContentNavigation>
      </ul>
    </div>
  </div>
</template>
