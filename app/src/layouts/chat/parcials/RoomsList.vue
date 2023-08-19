<script setup lang="ts">
import { storeToRefs } from 'pinia';
import CreateRoom from './CreateRoom.vue'
import { useRoomStore } from '@/store/room';
import { reactive } from 'vue';
import ListElement from './room/ListElement.vue'
import RoomSettings from './room/RoomSettings.vue'
import RoomSearch from './room/RoomSearch.vue'


const roomStore = useRoomStore();
const { drawer, rooms, roomSettings } = storeToRefs(roomStore);

const menu = reactive({
  value: false,
  position_x: 0,
  position_y: 0,
})


roomStore.getRooms();
</script>

<template>
  <room-settings v-if="roomSettings"> </room-settings>
  <v-navigation-drawer v-model="drawer" location="right" min-width="800">
    <v-list>
      <v-list-item>
        <room-search> </room-search>
        <template v-slot:append>
          <create-room></create-room>
        </template>
      </v-list-item>
      <list-element :rooms="rooms"> </list-element>
    </v-list>
  </v-navigation-drawer>
</template>
