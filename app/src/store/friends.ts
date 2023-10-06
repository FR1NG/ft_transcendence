import { defineStore } from "pinia";
import axios from '@/plugins/axios'
import { Friend } from "@/types/user";

export const useFriendsStore = defineStore("friends", {
    state: () => ({
      friends: [] as Friend[]

  }),
  actions: {
    async getFriends() {
      return new Promise(async (resolve, reject) => {
        try{
            const response = await axios.get('friend');
            const { data } = response
            this.friends = data;
            resolve(data);
        } catch (error: any) {
            reject(error.response);
      }
      });
    }
  }
});
