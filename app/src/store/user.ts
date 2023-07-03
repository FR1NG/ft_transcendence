import { defineStore } from 'pinia';
import axios from '@/plugins/axios'


export const useUserStore = defineStore('user', {
  state:() => ({
    profile: [],
    loading: true,
  }),
  getters: {

  },
  actions: {
    async getProfile(): Promise<any> {
      this.loading = true;
      return new Promise((resolve, reject) => {
        axios.get('user/profile').then(response => {
          const { data } = response;
          this.profile = data;
          this.loading = false;
          resolve(data)
        }).catch(error => {
            // do some loginc here to handle errors
            reject(error?.response?.data);
          });
      });
    },
    async updateProfile(data: any): Promise<any> {
      this.updating = true;
      return new Promise((resolve, reject) => {
        axios.patch('user', data).then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error?.response?.data);
          })
      })
    }
  },
});
