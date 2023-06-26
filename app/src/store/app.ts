// Utilities
import { defineStore } from 'pinia'
import { useUserStore } from './user.ts'
import { useAuthStore } from './auth.ts'

export const useAppStore = defineStore('app', {
  state: () => ({
    //
  }),
  getters: {

  },
  actions: {
    async getInitialData(): Promise<any> {
      const authStore = useAuthStore();
      const userStore = useUserStore();

      if(authStore.getLogged) {
        userStore.getProfile();
      }
    }
  }
})
