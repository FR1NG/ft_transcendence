import { defineStore } from 'pinia'
import { Conversation, Message } from '@/types/chat'
import axios from '@/plugins/axios'
import { User } from '@/types/user';
import { UserRoom } from '@/types/room';
import { AxiosResponse } from 'axios';
import { pushNotify } from '@/composables/simpleNotify';
import { UserConversation } from '@/types/stateTypes/userConversation';
import { resetObject } from '@/composables/helpers';

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: new Map() as Map<string, Conversation>,
    activeConversation: {} as Conversation,
    selectedUser: {} as  User,
    selectedRoom: {} as UserRoom,
    users: [] as UserConversation[],
    unreadedCount: 0,
    blocked: []
  }),
  getters: {

  },
  actions: {
    async getConversation(id: string, type: string) {
      if (!id)
        return;
      this.selectedUser = {} as User
      this.selectedRoom = {} as UserRoom
      const conversation = this.conversations.get(id);
      if(conversation) {
        this.activeConversation = conversation;

        if(type === 'dm')
          this.selectedUser = conversation.sender as User;
        else if (type === 'room')
          this.selectedRoom = conversation.sender as UserRoom;
      } else {
      try {
        const { data } = await axios.get(`/chat/conversation/${id}?type=${type}`);
        if(type === 'dm') {
          const { messages, messagesCount, user, conversationId} = data;
          this.conversations.set(data.user.id, {messages, sender: user, messagesCount, conversationId});
          this.selectedUser = data.user;
          this.activeConversation = data;
        } else if(type === 'room') {
            const {conversation, messagesCount, ...room} = data;
            this.conversations.set(id, {messages: conversation.messages, sender: room, conversationId: conversation.id, messagesCount});
            this.activeConversation.messages = conversation.messages;
            this.activeConversation.conversationId = conversation.id;
            this.activeConversation.messagesCount = messagesCount;
            this.selectedRoom = room;
          }
        this.scrollDown()
      } catch (error: any) {
        pushNotify({status:'error', title:'error', text:error.response.data.message})
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
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      });
    },
    addMessageToConversation(message: Message, id: string, type: 'dm' | 'room') {
      const conversation = this.conversations.get(id);
      if(conversation?.messages) {
        conversation.messages.push(message);
        if(type === 'dm' && !message.loading) {
          this.unreadedCount += 1;
          const indexOfUser = this.users.findIndex((el: any) => el.user.id === id);
          this.users[indexOfUser]?.unseen.push(message.id);
        }
      } else {
        if(conversation) {
        const messages = [
          message
        ];
          conversation["messages"] = messages;
          this.activeConversation.messages = messages;
        }
        else
          this.getConversationsUsers();
      }
      if(type === 'dm')
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
      if(!this.users.some((el: any) => el.id === dm.sender.id))
        this.getConversationsUsers();
    },
    deleteConversation(userId: string) {
      this.conversations.delete(userId);
    },
    resetActiveConversation() {
      this.selectedRoom = {} as UserRoom;
      this.selectedUser = {} as User;
      this.activeConversation = {} as Conversation;
    },

    async markeRead(id: string) {
      const index = this.users.findIndex((el: any) => el.user.id === id);
      const unseen = this.users.at(index)?.unseen.length || 0;
      if(!unseen)
        return;

      return new Promise(async (resolve, reject) => {
          try {
          const response: AxiosResponse = await axios.post('/chat/read', {
            id
          });
          const { data } = response;
          this.users[index].unseen = [];
          this.unreadedCount -= unseen;
          resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response)
        }
      })
    },
    makeTop(id: string) {
      const index = this.users.findIndex((el: any) => el.user.id === id);
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
    },
    reset() {
      this.conversations = new Map();
      this.activeConversation = {} as Conversation;
      this.selectedUser = {} as User;
      this.selectedRoom = {} as UserRoom;
      this.users = [] as UserConversation[];
    },
    getUnreadedMessagesCount() {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await axios.get('/chat/unreadedCount');
          this.unreadedCount = response.data;
          resolve(response.data)
        } catch(error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
        }
      })
    },
    // load more messages
    async loadMore(type: 'room' | 'dm') {
      return new Promise(async (resolve, reject) => {
          try {
          const response = await axios.get(`/chat/messages/load?id=${this.activeConversation.conversationId}&skip=${this.activeConversation.messages.length}&type=${type}`)
          const { data } = response;
          this.activeConversation.messages = [ ...data, ...this.activeConversation.messages];
          resolve(data);
        } catch(error: any) {
          resolve(error.response)
        }
        })
    },
    // get list of blocked users
    async getBlocked() {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await axios.get('friend/blocked');
          const {data} = response;
          console.log(data);
          this.blocked = data;
          resolve(data);
        } catch(error: any) {
          reject(error.response);
        }
      })
    }
  },// end of actions

})// end of define store
