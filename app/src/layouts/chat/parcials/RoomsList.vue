<script setup lang="ts">
import { storeToRefs } from 'pinia';
import CreateRoom from './CreateRoom.vue'
import { useRoomStore } from '@/store/room';
import { reactive, ref } from 'vue';
import ListElement from './room/ListElement.vue'
import RoomSettings from './room/RoomSettings.vue'
import RoomSearch from './room/RoomSearch.vue'
import type { SearchedRoom } from '@/types/room'
import JoinRoom from './room/JoinRoom.vue';


const roomStore = useRoomStore();
const { rooms, roomSettings } = storeToRefs(roomStore);

// join room
const roomToJoin = ref<SearchedRoom>();
const joinAppearance = ref(false);

const joinRoom = (room: SearchedRoom) => {
  roomToJoin.value = room;
  joinAppearance.value = true;
}

const joinClose = () => {
  joinAppearance.value = false;
}

try {
  roomStore.getRooms();
} catch(error) {}
</script>

<template>
  <JoinRoom v-if="joinAppearance" :room="roomToJoin" @close="joinClose"/>
    <v-list>
      <v-list-item>
        <room-search :join="joinRoom"> </room-search>
        <v-divider></v-divider>
        <template v-slot:append>
          <create-room></create-room>
        </template>
      </v-list-item>
      <list-element :rooms="rooms"> </list-element>
    </v-list>
</template>
