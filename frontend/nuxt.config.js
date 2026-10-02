export default defineNuxtConfig({
  ssr: false,
  experimental: {
    appManifest: false,
  },
  app: {
    head: {
      title: "Jachai | Ai Quiz generator application",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content:
            "Jachai is an AI-based quiz generator automatically creates personalized quizzes using artificial intelligence. Tailored to specific topics and difficulty levels, it’s ideal for education, corporate training, and personal learning. The AI generates questions, provides detailed explanations, and adapts to the learner’s progress, offering a dynamic and effective learning experience.",
        },
        {
          property: "og:url",
          content: "",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:title",
          content: "Jachai | Ai Quiz generator application",
        },
        {
          property: "og:description",
          content:
            "Jachai is an AI-based quiz generator automatically creates personalized quizzes using artificial intelligence. Tailored to specific topics and difficulty levels, it’s ideal for education, corporate training, and personal learning. The AI generates questions, provides detailed explanations, and adapts to the learner’s progress, offering a dynamic and effective learning experience.",
        },
        {
          property: "og:image",
          content: "/icon.svg",
        },
        {
          name: "twitter:card",
          content: "/icon.svg",
        },
        {
          name: "twitter:domain",
          content: "",
        },
        {
          name: "twitter:title",
          content: "Jachai | Ai Quiz generator application",
        },
        {
          name: "twitter:description",

          content:
            "Jachai is an AI-based quiz generator automatically creates personalized quizzes using artificial intelligence. Tailored to specific topics and difficulty levels, it’s ideal for education, corporate training, and personal learning. The AI generates questions, provides detailed explanations, and adapts to the learner’s progress, offering a dynamic and effective learning experience.",
        },
        {
          name: "twitter:image",
          content: "/icon.svg",
        },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/icon.svg",
        },
      ],
      __dangerouslyDisableSanitizers: ["script"],
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "@nuxtjs/sitemap",
  ],
  css: ["~/static/styles/global.css", "~/static/styles/button.css"],
  site: {
    url: "",
  },
  sitemap: {
    url: "",
  },
  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.VITE_BASE_URL,
      websiteUrl: process.env.VITE_WEBSITE_URL || "",
    },
  },
  compatibilityDate: "2024-09-20",
});
