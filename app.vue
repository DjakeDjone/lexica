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
      <button class="btn" @click="navOpen = !navOpen">Toggle Nav</button>
      <!-- Page content here -->
     <NuxtPage />
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
