// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   compatibilityDate: "2024-11-01",
// });

export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/api/**': { cors: true }
    }
  }
});