<script setup lang="ts">

import { useSocketStore } from '@/store/socket';
import { storeToRefs } from 'pinia';
import { Socket } from 'socket.io-client';
import { useRoute } from 'vue-router';

const socketStore = useSocketStore();
const { socket } = storeToRefs(socketStore);
const route = useRoute()


// listning for user joined the game event
const init  = () => {
    socket.value?.on('matchFound', (data: any) => {
    });
}

init();



</script>

<template>
  <v-card color="colorTwo" bg-color="colorOne" variant="outlined" class="ma-4 pa-4 d-flex justify-center" rounded="lg">
    <v-progress-circular
      :size="400"
      :width="15"
      color="colorOne"
      bg-color="colorTwo"
      indeterminate
    ></v-progress-circular>
  </v-card>
</template>
