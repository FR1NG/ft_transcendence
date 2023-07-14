import { defineStore } from 'pinia'
import axios from '@/plugins/axios'


export const useSearchStore = defineStore('search', {
  state: () => ({
    requestStatus: '',
    searchedUsers: [],
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
        } catch (error) {
          this.searchLoader = false;
          console.log(error)
        }
    },

    // clear the list of searched users
    clearSearch() {
      this.searchedUsers = []
    }
  }
})
