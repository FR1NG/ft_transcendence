import { defineStore } from 'pinia'
import { Conversation, Message } from '@/types/chat'
import axios from '@/plugins/axios'
import { User } from '@/types/user';
import { UserRoom } from '@/types/room';
import { AxiosResponse } from 'axios';
import { useAuthStore } from './auth';

type Conversation = {
  user: User,
  unseen: Array<string>
};

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: new Map() as Map<string, Conversation>,
    activeConversation: [] as Message[],
    selectedUser: {} as  User,
    selectedRoom: {} as UserRoom,
    users: [] as Conversation[]
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
        } else if(type === 'room') {
            const {conversation, ...room} = data;
            this.conversations.set(id, {messages: conversation.messages, sender: room});
            this.activeConversation = conversation.messages;
            this.selectedRoom = room;
          }
        this.scrollDown()
      } catch (error) {
        console.log(error)
      }
      }
    },
    async getConversationsUsers() {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.get('/chat/users');
          const { data } = response;
          this.users = data;
          resolve(data);
        } catch(error: any) {
          reject(error.response);
        }
      });
    },
    addMessageToConversation(message: Message, id: string): Conversation | undefined {
      const conversation = this.conversations.get(id);
      if(conversation?.messages) {
        conversation.messages.push(message);
        if(!message.loading) {
          const indexOfUser = this.users.findIndex((el: Conversation) => el.user.id === id);
          this.users[indexOfUser]?.unseen.push(message.id);
        }
      } else {
        // TODO tobe optimized
        this.getConversationsUsers();
        const messages = [
          message
        ];
        if(conversation) {
          conversation["messages"] = messages;
          this.activeConversation = messages;
        }
      }
      this.makeTop(id);
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
      dm.id = message.id;
      dm.sender = message.sender;
      dm.loading = false;
    },
    deleteConversation(userId: string) {
      this.conversations.delete(userId);
    },
    resetActiveConversation() {
      this.selectedRoom = {} as UserRoom;
      this.selectedUser = {} as User;
      this.activeConversation = [];
    },

    async markRead(id: string) {
      const index = this.users.findIndex((el: any) => el.user.id === id);
      if(this.users.at(index)?.unseen.length === 0)
        return;

      return new Promise(async (resolve, reject) => {
          try {
          const response: AxiosResponse = await axios.post('/chat/read', {
            id
          });
          const { data } = response;
          this.users[index].unseen = [];
          resolve(data);
        } catch (error: any) {
          reject(error.response)
        }
      })
    },
    makeTop(id: string) {
      const index = this.users.findIndex((el: Conversation) => el.user.id === id);
      if(index === 0)
        return;
      if (this.users[index]) {
        const obj = this.users[index];
        const user = { ...obj.user };
        const unseen = [ ...obj.unseen ];
        const newobj = { user, unseen }
        this.users.splice(index, 1);
        this.users.unshift(newobj)
      }
    }
  },// end of actions

})// end of define store
