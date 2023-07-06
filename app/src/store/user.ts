import { defineStore } from 'pinia';
import axios from '@/plugins/axios'


export const useUserStore = defineStore('user', {
  state: () => ({
    profile: [],
    loading: true,
    user: [],
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
    // updating profile
    async updateProfile(data: any): Promise<any> {
      return new Promise((resolve, reject) => {
        axios.patch('user', data).then(response => {
          resolve(response.data)
          this.getProfile();
          console.log(this.profile)
        }).catch(error => {
          reject(error?.response?.data);
        })
      })
    },
    // get user by username
    async getUser(username: string): Promise<any> {
      try {
          const { data } = await axios.get(`/user/filter/?username=${username}`);
          this.user = data;
      } catch(error) {
        console.log(error)
      }
    },
  },
});
