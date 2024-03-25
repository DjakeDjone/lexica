<script setup lang="ts">

const navOpen = ref(false)



</script>


<template>
  <div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
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
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <!-- Sidebar content here -->
        <ContentList path="/" v-slot="{ list }">
          <!-- {{ list }} -->
          <li v-for="article in list" :key="article._path">
            <NuxtLink :to="article._path" class="block p-2">
              {{ article.title }}
              {{ article.description }}
            </NuxtLink>
          </li>
        </ContentList>
      </ul>
    </div>
  </div>
  <!-- <main class="flex p-4">
    <nav v-auto-animate class="p-4 bg-white backdrop-blur-sm fixed 
    top-0 left-0 border-b pr-2 w-40 max-w-full transition-all" 
    :class="{ 'w-10 h-10': !navOpen }">
      <header>
        <button @click="navOpen = !navOpen" class="">
          <Icon name="line-md:menu-unfold-right" size="30"></Icon>
        </button>
      </header>
      <div v-if="navOpen">
        <ContentList :path="$route.path" v-slot="{ list }">
          <div v-for="article in list" :key="article._path">
            <NuxtLink :to="article._path" class="block p-2">
              {{ article.title }}
            </NuxtLink>
          </div>
        </ContentList>
      </div>
    </nav>
    <section>
      <ContentDoc />
    </section>
  </main> -->
</template>
