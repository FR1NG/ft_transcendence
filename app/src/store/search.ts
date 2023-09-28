import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import { User } from '@/types/user';
import { pushNotify } from '@/composables/simpleNotify';


export const useSearchStore = defineStore('search', {
  state: () => ({
    requestStatus: '',
    searchedUsers: [] as User[],
    search: '',
    searchLoader: false,
    searchTyping: false,
  }),
  getters: {
    isUserSerched: state => {
      return state.search.length != 0;
    }
  },
  actions: {
    // search a user
    async searchUsers(pattern: string): Promise<any> {
        try {
          this.searchLoader = true;
          const { data } = await axios.get(`/user/search/${pattern}`);
          this.searchedUsers = data;
          this.searchLoader = false;
        } catch (error: any) {
          this.searchLoader = false;
          pushNotify({status:'error', title:'error', text:error.response.data.message})
        }
    },

    // clear the list of searched users
    clearSearch() {
      this.searchedUsers = []
    }, 
    reset() {
      this.requestStatus = '';
      this.searchedUsers = [] as User[];
      this.search = '';
      this.searchLoader = false;
      this.searchTyping = false;
    }
  }
})
