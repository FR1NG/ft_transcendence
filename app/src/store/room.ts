import { defineStore } from 'pinia'
import { CreateRoomDto } from '@/types/room'
import axios from '@/plugins/axios'
import { AxiosResponse } from 'axios'

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
          reject(error.response);
        }
      })
    },
    async getRooms() {
      try {
        const response = await axios.get('/room');
        const { data } = response;
        this.rooms = data;
      } catch (error) {
        console.log(error)
      }
    },

    showSettings(id: string) {
      this.roomSettings = true;
    },
    async getRoomUsers(roomId: string): Promise<any> {
      console.log(roomId)
      return new Promise(async (resolve, reject) => {
        try {
        const response: AxiosResponse = await axios.get(`/room/users?id=${roomId}`);
          const { data } = response;
          resolve(data);
        } catch(error) {
          console.log(error)
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
          console.log(data);
          resolve(data);
        } catch (error) {
          console.log(error)
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
          console.log(error.response);
          reject(error.response);
        }
      })
    }
  }
})
