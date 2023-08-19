<script lang="ts" setup>
import { useRoomStore } from '@/store/room';
import { watch } from 'vue';
import { storeToRefs } from 'pinia'

const roomStore = useRoomStore()

const { roomSettings, selectedRoom } = storeToRefs(roomStore);

roomStore.getRoomUsers(selectedRoom.value.room.id);
</script>


<template>
  <v-row justrify="center">
    <v-dialog
      fullscreen
      transition="dialog-bottom-transition"
      v-model="roomSettings"
    >
    <v-card >
        <v-toolbar
          color="primary"
        >
          <v-btn @click="roomSettings = !roomSettings">close</v-btn>
        </v-toolbar>

        {{ selectedRoom.role}}
      </v-card>

    </v-dialog>
  </v-row>
</template>
