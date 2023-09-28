// Utilities
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useAuthStore } from './auth'

export const useAppStore = defineStore('app', {
  state: () => ({
    domain: import.meta.env.VITE_DOMAIN,
    api_url: import.meta.env.VITE_API_URL
  }),
  getters: {

  },
  actions: {
    async getInitialData(): Promise<any> {
      const authStore = useAuthStore();
      const userStore = useUserStore();

      if(authStore.checkAuth()) {
        userStore.getProfile();
      }
    }
  }
})
