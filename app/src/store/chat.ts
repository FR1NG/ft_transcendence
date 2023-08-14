import { defineStore } from 'pinia'
import { Conversation, Message } from '@/types/chat'
import axios from '@/plugins/axios'
import { User } from '@/types/user';

// type conversations = {
//   userId: string
//   messages: Message[]
// }

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: new Map() as Map<string, Conversation>,
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
        this.activeConversation = conversation.messages;
        this.selectedUser = conversation.user
      } else {
      try {
        const { data } = await axios.get(`/chat/user-conversation/${id}`);
        const { messages, user} = data;
          console.log(data)
        this.conversations.set(data.user.id, {messages, user});
        this.selectedUser = data.user;
        this.activeConversation = data.messages;
        this.scrollDown()
      } catch (error) {
        console.log('error whene getting messages');
        console.log(error)
      }
      }
    },
    addMessageToConversation(message: Message, userId: string): Conversation | undefined {
      const conversation = this.conversations.get(userId);
      conversation?.messages.push(message);
      return conversation;
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
    },
    changeMessageStatus(feedback: any) {
      const { recieverId, message } = feedback;
      const conversation: any = this.conversations.get(recieverId);
      const index = conversation.messages.findIndex(((el: Message) => el.id === feedback.tmpId));
      const dm = conversation.messages[index];
      dm.id = message.id;
      dm.loading = false;
    },
    deleteConversation(userId: string) {
      this.conversations.delete(userId);
    }
  },
})
