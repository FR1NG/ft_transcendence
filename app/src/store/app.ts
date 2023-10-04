// Utilities
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useAuthStore } from './auth'
import { useChatStore } from './chat';
import { useGameStore } from './game';
import { useInvitationStore } from './invitation';
import { useNotificationStore } from './notification';
import { useRoomStore } from './room';
import { useSearchStore } from './search';
import { useSocketStore } from './socket';

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
    },

    resetAll() {
        useAuthStore().reset();
        useChatStore().reset();
        useGameStore().reset();
        useInvitationStore().reset();
        useNotificationStore().reset();
        useRoomStore().reset();
        useSearchStore().reset();
        useSocketStore().reset();
        useUserStore().reset();
    }
  }
})
