import { defineStore } from 'pinia'
import { Message } from '@/types/chat'
import axios from '@/plugins/axios'
import { User } from '@/types/user';

// type conversations = {
//   userId: string
//   messages: Message[]
// }

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: new Map() as Map<string, Message[]>,
    activeConversation: [] as Message[],
    selectedUser: {} as  User

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
        this.conversations.set(data.user.id, data.messages);
        this.selectedUser = data.user;
        this.activeConversation = data.messages;
        this.scrollDown()
      } catch (error) {
        console.log('error whene getting messages');
        console.log(error)
      }
      }
    },
    addMessageToConversation(message: Message, userId: string) {
      const conversation = this.conversations.get(userId);
      conversation?.push(message);
    },
    playNotificationSound() {
      const audio = new Audio('../audio/notification.mp3')
      console.log(audio)
      audio.play();
    },
    scrollDown() {
      const html = document.querySelector('html')
      if (html) {
        html.scrollTop = html.scrollHeight
      }
    }
  },
})
