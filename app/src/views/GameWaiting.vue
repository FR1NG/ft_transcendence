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
  // console.log('listning to joined event')
  // socket.value?.on('user-joined', (data: any) => {
  //   console.log(data)
  //   console.log('joined triggred');
  // })

  //
  // // requesting game info if existed
  // const invitationId = route.params.invitationId as string;
  // socket.value?.emit('request-info', {invitationId});


    socket.value?.on('matchFound', (data: any) => {

      console.log('Received matchFound event with data:', data);
      // waitingForOpponent.value = false;
      // showStartButton.value = true;
      // playerId.value = data.role;
      // gameId.value = data.gameId;
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
