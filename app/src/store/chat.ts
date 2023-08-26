import { defineStore, storeToRefs } from 'pinia'
import { Conversation, Message } from '@/types/chat'
import axios from '@/plugins/axios'
import { User } from '@/types/user';
import { Room, UserRoom } from '@/types/room';
import { useAuthStore } from './auth';

// type conversations = {
//   userId: string
//   messages: Message[]
// }

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: new Map() as Map<string, Conversation>,
    activeConversation: [] as Message[],
    selectedUser: {} as  User,
    selectedRoom: {} as UserRoom

  }),
  getters: {

  },
  actions: {
    async getConversation(id: string, type: string) {
      console.log(`getting conversation with id: ${id}, type ${type}`);
      if (!id)
        return;
      const conversation = this.conversations.get(id);
      if(conversation) {
        console.log('exists');
        this.activeConversation = conversation.messages;
        this.selectedUser = conversation.user as User;
      } else {
      try {
          console.log('getting it')
        const { data } = await axios.get(`/chat/conversation/${id}?type=${type}`);
        if(type === 'dm') {
          const { messages, user} = data;
          this.conversations.set(data.user.id, {messages, user});
          this.selectedUser = data.user;
          this.activeConversation = data.messages;
        } else if(type === 'room') {
            console.log('got room');
            const {conversation, ...room} = data;
            console.log(conversation, room);
            this.conversations.set(room.id, {messages: conversation.messages, sender: room});
            this.activeConversation = conversation.messages;
            this.selectedRoom = room;
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
      if(conversation?.messages) {
        conversation.messages.push(message);
      } else {
        const messages = [
          message
        ];
        if(conversation) {
          conversation["messages"] = messages;
          this.activeConversation = messages;
        }
      }
      return conversation;
    },
    playNotificationSound() {
      const audio = new Audio('/audio/notification.wav')
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
      console.log(index);
      console.log(conversation);
      console.log(feedback);
      dm.id = message.id;
      dm.sender = message.sender;
      dm.loading = false;
    },
    deleteConversation(userId: string) {
      this.conversations.delete(userId);
    }
  },
})
