import { defineStore } from 'pinia';
import axios from '@/plugins/axios'


export const useUserStore = defineStore('user', {
  state: () => ({
    profile: [],
    loading: true,
    user:{
      friendRequestsSent: [{}],
      friendRequestsRecieved: [{}]
    },
    requestStatus: ''
  }),
  getters: {
    getRequstStatus: state => {
      if(state.user.friendRequestsSent?.length > 0)
        return 'recieved';
      else if(state.user.friendRequestsRecieved?.length > 0)
        return 'sent';
      else
        return 'none';
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
          console.log(data)
      } catch(error) {
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
          console.log(data)
          this.user.friendRequestsRecieved[0] = {id: data.id, status: 'sent'}
        } catch (error) {
          reject(error);
        }
      })

    },
    // cancel friend request
    cancelFriendRequest(id: number): Promise<any> {
      return new Promise(async(resolve, reject) => {
        try {
          const result = await axios.delete('/friend', {
            data: {
              id
            }
          });

          console.log(result);
          this.user.friendRequestsRecieved = []
          resolve(result)
        } catch (error) {
          console.log(error);
          reject(error)
        }
      })
    }
  },
});
