import { defineStore } from 'pinia'
import { Message } from '@/types/chat'
import axios from '@/plugins/axios'

// type conversations = {
//   userId: string
//   messages: Message[]
// }

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: new Map() as Map<string, Message[]>,
    activeConversation: [] as Message[]

  }),
  getters: {

  },
  actions: {
    async getUsersConversation(id: string) {
      if (!id)
        return;
      const conversation = this.conversations.get(id);
      if(conversation) {
        this.activeConversation = conversation;
      } else {
      try {
        const { data } = await axios.get(`/chat/user-conversation/${id}`);
        this.conversations.set(data.userId, data.messages);
        this.activeConversation = data.messages;
      } catch (error) {
        console.log('error whene getting messages');
        console.log(error)
      }
      }
    },
    addMessageToConversation(message: Message, userId: string) {
      const conversation = this.conversations.get(userId);
      conversation?.push(message);
    }
  },
})
