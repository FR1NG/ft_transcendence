import { defineStore } from 'pinia';
import { Socket, io } from 'socket.io-client';
import type { Message } from '@/types/chat';

type Auth = {
  auth: Token
}

type Token = {
  token?: string
}
type MySocket = Socket & Auth;
export const useSocketStore = defineStore('socket', {
  // state
  state: () => ({
    socket: null as MySocket | null,
  }),
  // getters
  getters: {

  },
  // actions
  actions: {
    init(domain: string, config: {}) {
      if(!this.socket) {
        this.socket = io(domain, config);
        return true;
      }
      return false;
    },

    listen(eventCallback: (type: string, {}) => void | null, errorCallback: ({}) => void | null) {
      if(!this.socket)
        return this.throwError();
      // listning on message event
      this.socket.on('message', (data) => {
        if(eventCallback)
          eventCallback('message', data);
        this.handleMessage(data);
      });

      // listning on room message event
      this.socket.on('room-message', (data) => {
        if(eventCallback)
          eventCallback('room-message', data);
        this.handleRoomMessage(data);
      });

      // listning for error event
      this.socket.on('error', (data) => {
        if(errorCallback)
          errorCallback(data);
      })

    },
    handleMessage(data: any) {
    },

    handleRoomMessage(data: any) {
    },
    // send a message action
    sendMessage(content: string, recieverId: string, type: 'dm' | 'room', callback: ({}) => void): Message {
      if(!this.socket)
        return this.throwError();
      this.setToken(sessionStorage.getItem('access_token') as string);
      console.log(this.socket);
      const tmpId = Math.random().toString();
      const message: Message = {
        content,
        id: tmpId,
        user: {
          id: '',
          username: '',
          avatar: ''
        },
        loading: true
      };

      // emit event
      this.socket.emit('message', {
        content,
        recieverId,
        type: type,
        id: tmpId
      }, (feed: any) => {
        callback(feed);
      });
      return message;
    },

    throwError(message: string | null = null) {
        throw new Error(message || 'uninitialized socket, try to call init method from the socket store');
    },
    // set the socket access token
    setToken(token: string) {
    if(this.socket) {
      this.socket.auth.token = token;
    }
    }
  },

})
