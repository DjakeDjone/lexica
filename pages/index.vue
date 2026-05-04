<template>
  <main class="min-h-screen bg-base-100 text-base-content pt-4">
    <div class="w-full max-w-4xl space-y-16">
      
      <!-- Header Section -->
      <header class="mb-4">
        <h1 class="text-5xl sm:text-6xl md:text-7xl font-black uppercase text-base-content leading-none">
          Welcome to Lexica!
        </h1>
      </header>

      <!-- Introduction & Features -->
      <section class="flex flex-col gap-8">
        <p class="text-lg sm:text-xl md:text-2xl text-base-content/80 leading-relaxed font-medium">
          - my personal knowledge base, with all my notes from school, as well as other markdowns.
        </p>
      </section>

      <!-- Latest Changes Section -->
      <section class="flex flex-col gap-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-base-content/90 border-b border-base-content/30 pb-3">
          Latest Changes
        </h2>

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center gap-3 text-base-content/60 py-4">
          <span class="loading loading-spinner loading-md text-primary"></span>
          <span class="text-lg">Loading latest commits...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-error shadow-sm rounded-box">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Could not load latest commits right now.</span>
        </div>

        <!-- Empty State -->
        <div v-else-if="commits.length === 0" class="text-base-content/60 text-lg italic py-2">
          No recent commits found.
        </div>

        <!-- Data State -->
        <ul v-else class="flex flex-col gap-4">
          <li v-for="commit in commits" :key="commit.url" class="flex items-start gap-3 sm:gap-4 group">
            <!-- Custom Clean Bullet Point -->
            <div class="w-2 h-2 rounded-full bg-primary mt-2.5 opacity-50 group-hover:opacity-100 transition-opacity shrink-0"></div>
            
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <a :href="commit.url" target="_blank" rel="noopener noreferrer" class="link-accessible text-lg sm:text-xl font-medium">
                {{ commit.message }}
              </a>
              <span class="text-sm sm:text-base text-base-content/50 whitespace-nowrap font-mono">
                ({{ formatDate(commit.date) }})
              </span>
            </div>
          </li>
        </ul>
      </section>

      <!-- Latest Content Section -->
      <section class="flex flex-col gap-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-base-content/90 border-b border-base-content/30 pb-3">
          Latest Content
        </h2>

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center gap-3 text-base-content/60 py-4">
          <span class="loading loading-spinner loading-md text-primary"></span>
          <span class="text-lg">Loading content changes...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-error shadow-sm rounded-box">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Could not load content right now.</span>
        </div>

        <!-- Empty State -->
        <div v-else-if="contentFiles.length === 0" class="text-base-content/60 text-lg italic py-2">
          No recent content changes found.
        </div>

        <!-- Data State -->
        <ul v-else class="flex flex-col gap-4">
          <li v-for="file in contentFiles" :key="file.path" class="flex items-start gap-3 sm:gap-4 group">
             <!-- Custom Clean Bullet Point -->
             <div class="w-2 h-2 rounded-full bg-primary mt-2.5 opacity-50 group-hover:opacity-100 transition-opacity shrink-0"></div>
            
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 w-full overflow-hidden">
              <NuxtLink :to="file.route" class="link-accessible text-lg sm:text-xl font-medium break-all sm:break-normal">
                {{ file.path }}
              </NuxtLink>
            </div>
          </li>
        </ul>
      </section>

    </div>
  </main>
</template>

<script setup lang="ts">
// Logic remains unchanged
const { data, pending, error } = await useFetch('/api/github-content-changes', {
  default: () => ({
    generatedAt: '',
    commits: [],
    contentFiles: []
  })
})

const commits = computed(() => data.value?.commits ?? [])
const contentFiles = computed(() => data.value?.contentFiles ?? [])

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) {
    return 'unknown date'
  }

  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diff === 0) return 'today'
  if (diff === 1) return 'yesterday'
  if (diff < 30) return `${diff} days ago`

  const months = Math.floor(diff / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}
</script>
