import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  // ssr: false,

  modules: ['@nuxt/content', '@formkit/auto-animate', '@vueuse/nuxt', '@nuxt/icon'],

  vite: {
    plugins: [tailwindcss()],
  },
  ssr: false,

  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  css: ["~/assets/app.css"],


  content: {
    build: {

      markdown: {
        remarkPlugins: {
          'remark-math': require('remark-math')
        },
        rehypePlugins: {
          'rehype-katex': require('rehype-katex')
        },

        highlight: {
          theme: {
            // Default theme (same as single string)
            default: 'github-light',
            // Theme used if `html.dark`
            dark: 'one-dark-pro',
          },
          langs: ['javascript', 'typescript', 'dart', 'json', 'java', 'rust', 'bash', 'sql', 'python', 'markdown', 'xml', 'nginx', 'bash'],
        },
        // experimental: {
        //   advanceQuery: true,
        // },
      },
    },
  },

  runtimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  },

  compatibilityDate: '2024-09-23'
})