import { defineStore } from 'pinia'
import { Conversation, Message } from '@/types/chat'
import axios from '@/plugins/axios'
import { User } from '@/types/user';
import { Room } from '@/types/room';

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
    async getConversation(id: string, type: string) {
      if (!id)
        return;
      const conversation = this.conversations.get(id);
      if(conversation) {
        this.activeConversation = conversation.messages;
        this.selectedUser = conversation.user as User;
      } else {
      try {
        const { data } = await axios.get(`/chat/conversation/${id}?type=${type}`);
        if(type === 'dm') {
          const { messages, user} = data;
          this.conversations.set(data.user.id, {messages, user});
          this.selectedUser = data.user;
          this.activeConversation = data.messages;
          console.log(data);
        } else if(type === 'room') {
            const { id, conversation } = data;
            this.conversations.set(id, {messages: conversation.messages});
            this.activeConversation = conversation.messages;
            console.log(data);
          }
        this.scrollDown()
      } catch (error) {
        console.log('error whene getting messages');
        console.log(error)
      }
      }
    },
    addMessageToConversation(message: Message, id: string): Conversation | undefined {
      const conversation = this.conversations.get(id);
      console.log(id);
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
      console.log(feedback);
      const dm = conversation.messages[index];
      dm.id = message.id;
      dm.sender = message.sender;
      dm.loading = false;
    },
    deleteConversation(userId: string) {
      this.conversations.delete(userId);
    }
  },
})
