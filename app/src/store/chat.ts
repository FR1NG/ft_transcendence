import { defineStore } from 'pinia'
import { Message } from '@/types/chat'
import axios from '@/plugins/axios'


const useChatStore = defineStore('chat',{
  state:() => ({
    messages: [] as Message[]
  }),
  getters: {

  },
  actions: {
    async getConversation(id: string) {
      try {
        const conversation = await axios.get(`/conversation/${id}`);
        console.log(conversation)
      } catch (error) {
        console.log(error)
      }

    }
  }
})
