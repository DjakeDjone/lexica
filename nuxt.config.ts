// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@formkit/auto-animate',
    '@nuxtjs/fontaine',
    'nuxt-icon',
    '@vueuse/nuxt'
  ],
  content: {
    highlight: {
      theme: {
        // Default theme (same as single string)
        default: 'github-light',
        // Theme used if `html.dark`
        dark: 'github-dark',
        // Theme used if `html.sepia`
        sepia: 'monokai'
      }
    },
    experimental: {
      advanceQuery: true,
      // search: {
      //   indexed: false,
      //   options: {
      //     fields: ['title', 'description', 'slug', 'text'],
      //   }
      // }
    },
  }
})