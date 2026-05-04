import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  preset: "vercel",

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      title: "Lexica",
      titleTemplate: "%s",
      meta: [
        {
          name: "description",
          content: "Lexica is a personal knowledge base with school notes, markdown documents, and study tools.",
        },
        {
          property: "og:title",
          content: "Lexica",
        },
        {
          property: "og:description",
          content: "A personal knowledge base with school notes, markdown documents, and study tools.",
        },
        {
          property: "og:url",
          content: "https://lexica.fri3dl.dev",
        },
      ],
      link: [
        {
          rel: "canonical",
          href: "https://lexica.fri3dl.dev",
        },
      ],
    },
  },

  icon: {
    fallbackToApi: false,
    serverBundle: {
      collections: [
        "emojione-monotone",
        "hugeicons",
        "icon-park-twotone",
        "line-md",
        "mdi",
        "system-uicons",
        "vaadin",
      ],
    },
  },

  modules: [
    "@nuxt/content",
    "@formkit/auto-animate",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "~/modules/embeddings",
    "nuxt-component-meta",
  ],

  vite: {
    plugins: [tailwindcss()],
  },
  ssr: true,

  llms: {
    domain: 'https://lexica.fri3dl.dev',
    title: 'Lexica',
    description: 'My personal notes/markdowns, mainly for school',
  },

  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },

  css: ["~/assets/app.css"],

  content: {
    build: {
      markdown: {
        remarkPlugins: {
          "remark-math": require("remark-math"),
        },
        rehypePlugins: {
          "rehype-katex": require("rehype-katex"),
        },

        highlight: {
          theme: {
            // Default theme (same as single string)
            default: "github-light",
            // Theme used if `html.dark`
            dark: "one-dark-pro",
          },
          langs: [
            "javascript",
            "typescript",
            "dart",
            "json",
            "java",
            "rust",
            "bash",
            "sql",
            "python",
            "markdown",
            "xml",
            "nginx",
            "bash",
          ],
        },
        // experimental: {
        //   advanceQuery: true,
        // },
      },
    },
  },

  runtimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY,
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
  },

  compatibilityDate: "2024-09-23",
});
