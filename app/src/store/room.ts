import { defineStore } from 'pinia'
import { CreateRoomDto } from '@/types/room'
import axios from '@/plugins/axios'
import { AxiosError, AxiosResponse } from 'axios'
import { useChatStore } from './chat'
import { pushNotify } from '@/composables/simpleNotify'
import { useSocketStore } from './socket'

type UserRoom = {
  role: String
  room: Room
}

type Room = {
  is: String
  name: String
}
export const useRoomStore = defineStore('room', {
  state: () => ({
    drawer: true,
    // type to be created lather
    rooms: [] as UserRoom[],
    roomSettings: false,
    selectedRoom: {} as UserRoom,
    searchedRooms: [] as UserRoom[],
    searching: false,
  }),
  getters: {
    isSearched: (state) => {
      return state.searchedRooms.length != 0;
    }
  },
  actions: {
    async createRoom(room: CreateRoomDto): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post('/room', {
            ...room
          });
          this.getRooms();
         resolve(response.data)
        } catch (error: any ) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      })
    },
    async getRooms() {
      try {
        const response = await axios.get('/room');
        const { data } = response;
        this.rooms = data;
      } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
      }
    },

    showSettings(id: string) {
      this.roomSettings = true;
    },
    async getRoomUsers(roomId: string): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
        const response: AxiosResponse = await axios.get(`/room/users?id=${roomId}`);
          const { data } = response;
          resolve(data);
        } catch(error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error)
        }
      });
    },

    async searchRoom(pattern: string): Promise<any> {

      if(!pattern)
        return;
      this.searching = true;
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await axios.get(`/room/search/${pattern}`);
          this.searchedRooms = data;
          this.searching = false;
          resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          this.searching = false
          reject(error)
        }
      })
    },

    async joinRoom(id: string, password: string) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post('/room/join', {
            id,
            password
          });
          const { data } = response;
          this.getRooms();
          resolve(data);
        } catch(error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      })
    },
    async getRoomDetails(id: string) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.get(`/room/${id}`);
          const { data } = response;
          resolve(data);
        } catch (error: AxiosError | any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error?.response);
        }
      })
    },

  async addAdmin(roomId: string, userId: string): Promise<any>  {
    return new Promise(async (resolve, reject) => {
      try {
        const response: AxiosResponse = await axios.post('/room/admin', {
          roomId,
          userId
        });
        const { data } = response;
        resolve(data)
      } catch(error: AxiosError | any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
        reject(error.response)
      }

    })
   },

    async removeAdmin(roomId: string, userId: string): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.delete('/room/admin', {
            data: {
              roomId,
              userId
            }
          });
          const { data } = response;
          resolve(data)
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response)
        }
      });
    },

   async kickUser(roomId: string, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post('/room/kick', {
            roomId,
            userId
          });
          const { data } = response;
          resolve(data);
        } catch (error: AxiosResponse | any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response)
        }
      });
    },


   async banUser(roomId: string, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post('/room/ban', {
            roomId,
            userId
          });
          const { data } = response;
          resolve(data);
        } catch (error: AxiosResponse | any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response)
        }
      });
    },
   async unbanUser(roomId: string, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post('/room/unban', {
            roomId,
            userId
          });
          const { data } = response;
          resolve(data);
        } catch (error: AxiosResponse | any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response)
        }
      });
    },

    // laeve a room
    async leaveRoom(roomId: string): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post('/room/leave', {
            roomId
          });
          const { data } = response;
          useChatStore().deleteConversation(roomId);
          resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      });
    },

    // update room data TODO: data type any from now, make a type for it
    async updateRoom(id: string, room: any) {
      return new Promise(async (resolve, reject) => {
        try {
            const response: AxiosResponse = await axios.patch(`/room/${id}`, room);
            const { data } = response;
            resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      });
    },

    // invite a user to room
    async inviteUser(roomId: string, userId: string) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post('/room/invite', {
            roomId,
            userId,
          });
          const { data } = response;
          resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      });
    },

    // cancel user's invitation for a room
    async cancelInvitation(roomId: string, userId: string) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.delete('/room/invite', {
            data: {
              roomId,
              userId
            }
          });

          const { data } = response;
          resolve(data);
        } catch(error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      });
    },

    // getting invitions to join the room
    async getInvitation(id: string) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.get(`/invitation/${id}`)
          const { data } = response;
          resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      })
    },
    // accept invitation to join the room
    async acceptInvitation(id: string) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post(`/invitation/accept/${id}`);
          const { data } = response;
          resolve(data);
          await this.getRooms();
          useSocketStore().getSocket()?.emit('join-room', {id: data.roomId});
        } catch (error: any) {
          pushNotify({status: 'error', title: 'error', text: error.response.data.message})
          reject(error.response);
        }
      });
    },

    // decline invitation to join the room
    async declineInvitation(id: string) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post(`/invitation/decline/${id}`);
          const { data } = response;
          resolve(data);
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      });
    },

    // mute a user
    async muteUser(roomId: string, userId: string, time: string) {
      return new Promise(async (resolve, reject) => {
          try {
          const response: AxiosResponse = await axios.post('/room/mute',{
            roomId,
            userId,
            time
          });
          const { data } = response;
          pushNotify({status:'success', title:'Action completed', text:data.message})
          resolve(data);
        } catch(error: any){
          pushNotify({status:'error', title:'error', text:error.response.data.message})
          reject(error.response);
        }
      })
    },
    reset () {
      this.drawer = true;
      this.rooms = [] as UserRoom[];
      this.roomSettings = false;
      this.selectedRoom = {} as UserRoom;
      this.searchedRooms = [] as UserRoom[];
      this.searching = false;
    }

   }, // INFO end of actions
}); // INFO end of defineStore

