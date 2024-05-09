<script setup lang="ts">
import './assets/defaultcss.css';

export type NavItem = {
  title: string
  _path: string
}

export type NestedNavItem = NavItem & {
  children?: NestedNavItem[],
  open?: boolean
}


const navOpen = ref(false)
const path = ref('')
const scroller = ref(false);
const searching = ref(false);

// update path
watchEffect(() => {
  path.value = useRoute().path;
});

onMounted(() => {
  let currentScroll = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY < currentScroll) {
      scroller.value = window.scrollY > 100;
    } else {
      scroller.value = false;
    }
    currentScroll = window.scrollY;
  });
  document.addEventListener('keydown', (e) => {
    // STRG + K
    if (e.ctrlKey && e.key === 'k' || e.metaKey && e.key === 'k' || e.key === '/') {
      // prevent default
      e.preventDefault();
      searching.value = !searching.value;
    } else if (e.key === 'Escape') {
      searching.value = false;
    } else if (e.key === 'ArrowUp') {
      scrollToTop();
    }
  });
});

const getFileName = (path: string) => {
  const parts = path.split('/');
  let name = parts[parts.length - 1];
  if (name === '') {
    name = parts[parts.length - 2];
  }
  if (name.length > 0) {
    // return the # and everything after it
    if (name.includes('#')) {
      name = name.split('#')[1];
    }
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  if (name.trim().length === 0) {
    name = 'Home';
  }
  return name;
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


</script>


<template>
  <div class="drawer p-4">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" v-model="navOpen" />
    <div class="drawer-content">
      <nav class="flex items-end mb-4">
        <button class="xl:fixed top-4 left-4 btn btn-primary p-2 mr-8" @click="navOpen = !navOpen">
          <Icon name="line-md:menu" size="30" />
        </button>
        <h1 class="xl:ml-16 text-3xl font-bold max-w-[calc(100vw-2rem)] overflow-hidden whitespace-nowrap">{{ getFileName(path)
          }}</h1>
      </nav>
      <!-- Page content here -->
      <div class="fixed top-0 left-0 z-30">
        <Search v-if="searching" @update:close="searching = false" />
      </div>
      <div class="xl:ml-16">
        <NuxtPage />
      </div>
      <div id="topScroll" class="fixed bottom-4 right-4">
        <button v-if="scroller" class="btn btn-primary rounded-full p-2 h-fit shadow-xl animate-bounce"
          @click="scrollToTop()">
          <Icon name="line-md:arrow-up-circle" size="45" />
        </button>
      </div>
    </div>
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul v-auto-animate class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <li class="m-0 flex flex-row items-center">
          <div class="inline w-fit relative">
            <h2 class="w-fit mt-0 text-2xl">
              FRI3DL DOCS
            </h2>
          </div>
        </li>
        <li class="m-0" @click="navOpen = false; searching = !searching">
          <button class="inline-flex justify-between items-end">
            <div class="flex gap-1">
              <Icon name="icon-park-twotone:search" size="25" />
              <span class="mr-2 mt-1">Search</span>
            </div>
            <div class="mr-2 opacity-50 hover:opacity-100 transition-opacity">
              <kbd class="kbd kbd-sm">ctrl</kbd>
              +
              <kbd class="kbd kbd-sm">k</kbd>
            </div>
          </button>
        </li>
        <div class="divider"></div>
        <h2 class="text-lg font-bold">Navigation</h2>
        <ContentNavigation v-slot="{ navigation }">
          <li class="m-0">
            <NuxtLink to="/lohnrechner">
              Lohnrechner
            </NuxtLink>
          </li>
          <nested-nav-item @update:navOpen="navOpen = false" :navigation="navigation" />
        </ContentNavigation>
      </ul>
    </div>
  </div>
</template>
