// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   devtools: { enabled: true }
// })
import { defineNuxtConfig } from 'nuxt/config'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  //...
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxtjs/apollo',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'http://localhost:8000/graphql'
      }
    },
  },
})

