import { defineStore } from 'pinia';
import { Notification } from '@/types/notification';
import axios from '@/plugins/axios'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[]
  }),
  getters: {

  },
  actions: {
    async getNotifications() {
      try {
        const  { data } = await axios.get('/notification');
        this.notifications = data;
        console.log(data);
      } catch (error) {
        console.log(error)
      }
    }
  }
})
