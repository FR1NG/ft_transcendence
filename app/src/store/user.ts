import { defineStore } from 'pinia';
import axios from '@/plugins/axios'
import type { User } from '@/types/user'
import { useChatStore } from './chat';
import { AxiosResponse } from 'axios';
import { pushNotify } from '@/composables/simpleNotify';


export const useUserStore = defineStore('user', {
  state: () => ({
    profile: [],
    loading: true,
    user: {} as User,
  }),
  getters: {
    friendsCount: state => {
      return 0;
      // return state.user._count?.friendOf + state.user._count?.friendWith || 0;
    },
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
        }).catch(error => {
          reject(error?.response?.data);
        })
      })
    },
    // get user by username
    async getUser(username: string): Promise<any> {
      if(!username)
        return;
      try {
        const { data } = await axios.get(`/user/filter/?username=${username}`);
        this.user = data;
      } catch (error: any) {
        pushNotify({status:'error', title:'error', text:error.response.data.message})
      }
    },

    // send frien request
    sendFriendRequest(id: string): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await axios.post('/invitation', {
            userId: id,
            type: 'FRIEND'
          });
          this.user.invitationId = data.id;
          this.user.friendshipStatus = 'INVITATION_SENT';
          resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error);
        }
      })
    },
    // cancel friend request
    cancelFriendRequest(id: string): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          const result = await axios.delete(`/invitation/${id}`);
          this.user.invitationId = '';
          this.user.friendshipStatus = 'NONE';
          resolve(result)
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error)
        }
      })
    },

    // unfriend a user
    async unfriend(userId: string) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.delete('/friend', {
            data: {
              userId
            }
          });
          const { data } = response;
          this.user.friendshipStatus = 'NONE';
          resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      });
    },

    // blocker user
    async blockUser(id: string): Promise<any> {
      const chatStore = useChatStore();
      return new Promise(async (resolve, reject) => {
        try {
          const response = await axios.post('user/block', {
            id
          });
          chatStore.deleteConversation(id);
          this.user.blocked = true;
          resolve(response);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error);
        }
      });
    },

    // unblock user
    async unblockUser(id: string): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await axios.post('/user/unblock', {
            id
          });
          resolve(response);
          this.user.blocked = false;
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error)
        }
      })
    },
    reset() {
      this.profile =  [];
      this.loading = true;
      this.user = {} as User;
    }
  },
});
