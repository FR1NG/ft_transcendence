<script lang="ts" setup>
import { useRoomStore } from '@/store/room';
import { watch } from 'vue';
import { storeToRefs } from 'pinia'

const roomStore = useRoomStore()

const { roomSettings } = storeToRefs(roomStore);

// roomStore.getRoomInfo();
</script>


<template>
  <v-dialog v-model="roomSettings">
    <v-card width="500" min-height="400">
    </v-card>
  </v-dialog>
</template>
