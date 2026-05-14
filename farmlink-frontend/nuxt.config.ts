// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  pages: true,
  ssr: false, 
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    },
  },
  css: ['@/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  tailwindcss: {
    configPath: '~/tailwind.config.ts'
  },
  app: {
    head: {
      script: [
        {
          src: 'https://accounts.google.com/gsi/client',
          async: true,
          defer: true,
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
})
