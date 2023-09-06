import { defineStore } from 'pinia';
import { Notification } from '@/types/notification';
import axios from '@/plugins/axios'
import { AxiosResponse } from 'axios';

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
  }),
  getters: {
    unseenIds: state => {
      const arr: Array<number> = [];
      state.notifications.forEach(el => {
        if(!el.seen)
          arr.push(el.id);
      });
      return arr;
    },
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
    },
    async markRead(ids: Array<number>) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post('/notification/read', {
            ids
          });
          const { data } = response;
          resolve(data);
          this.getNotifications();
        }catch (error: any) {
          reject(error.response);
        }

      });
    }
  }// end of actions
}); // end of define store
