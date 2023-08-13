import { defineStore } from 'pinia';
import axios from '@/plugins/axios'
import type { User } from '@/types/user'
import { useChatStore } from './chat';


export const useUserStore = defineStore('user', {
  state: () => ({
    profile: [],
    loading: true,
    user:{} as User,
  }),
  getters: {
    getRequstStatus: state => {
      if(state.user.friendRequestsSent?.length > 0) {
        if(state.user.friendRequestsSent[0].status === "PENDING")
          return 'recieved';
        else
          return 'friends'
      }
      else if(state.user.friendRequestsRecieved?.length > 0) {
        if(state.user.friendRequestsRecieved[0].status === "PENDING")
          return 'sent';
        else
          return 'friends'
      }
      else
        return 'none';
    },
    friendsCount: state => {
      return state.user._count?.friendOf + state.user._count?.friendWith || 0;
    },
    isBlocked: state => {
      return state.user._count?.blockedBy > 0;
    }
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
      try {
          const { data } = await axios.get(`/user/filter/?username=${username}`);
          this.user = data;
        console.log('succed')
      } catch(error) {
        console.log('error')
        console.log(error)
      }
    },

    // send frien request
    sendFriendRequest(id: string): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await axios.post('/friend',{
            id
          });
          resolve(data);
          this.user.friendRequestsRecieved[0] = {id: data.id, status: 'PENDING'}
        } catch (error) {
          reject(error);
        }
      })

    },
    // cancel friend request
    cancelFriendRequest(id: string): Promise<any> {
      return new Promise(async(resolve, reject) => {
        try {
          const result = await axios.delete('/friend', {
            data: {
              id
            }
          });
          resolve(result)
        } catch (error) {
          console.log(error);
          reject(error)
        }
      })
    },

  // confirm friend request
  confirmFriendRequest(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post('/friend/confirm', {
          id,
        });
        resolve(data);
        this.user.friendRequestsSent[0] = {id: data.id, status: 'CONFIRMED'}
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
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
          resolve(response);
          this.user._count.blockedBy = 1;
        } catch(error) {
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
          this.user._count.blockedBy = 0;
          console.log(this.user)
        } catch (error) {
          console.log('erro when unblocking user')
          reject(error)
        }
      })
    }

  },
});
