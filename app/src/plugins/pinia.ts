import { createPinia } from "pinia"
import router from '../router'
import { Router } from "vue-router"
import { markRaw } from "vue"

const pinia = createPinia()
pinia.use(({store}) => {
  store.router = markRaw(router)
})

pinia.use(({ app }) => {
  $api_url: import.meta.env.VITE_API_URL
})

declare module 'pinia' {
  interface PiniaCostumeProperties {
    router: Router
  }
}

export default pinia;
