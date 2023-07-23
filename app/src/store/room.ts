import { defineStore } from 'pinia'
import { CreateRoomDto } from '@/types/room'
import axios from '@/plugins/axios'

export const useRoomStore = defineStore('room', {
  state: () => ({
    drawer: false
  }),
  getters: {

  },
  actions: {
    async createRoom(room: CreateRoomDto) {
      const response = await axios.post('/room', room);
      console.log('response here')
      console.log(response);
    }
  }
})
