// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  sourcemap: {
    server: true,
    client: true
  },
  typescript: {
    shim: false
  },
  css: ["vuetify/lib/styles/main.sass", "@mdi/font/css/materialdesignicons.min.css", "v-network-graph/lib/style.css"],
  build: {
    transpile: ['vuetify'],
    
  },
  vite: {
    build: {
      sourcemap: 'inline'
    },
    define: {
      'process.env.DEBUG': false,
    },
  },

  // Auto import stores dir and pinia
  imports: {
    dirs: ['stores'],
  },
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
  ],

})
