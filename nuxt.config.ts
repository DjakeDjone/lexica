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
    markdown: {
      remarkPlugins: ["remark-math"],
      rehypePlugins: ["rehype-mathjax"],
    },
    highlight: {
      theme: {
        // Default theme (same as single string)
        default: 'github-light',
        // Theme used if `html.dark`
        dark: 'one-dark-pro',
      },
      langs: ['javascript', 'typescript','dart', 'json', 'java', 'rust', 'bash', 'sql', 'python', 'markdown', 'xml', 'nginx', 'bash'],
    },
    experimental: {
      advanceQuery: true,
    },
  },

  compatibilityDate: '2024-09-23'
})