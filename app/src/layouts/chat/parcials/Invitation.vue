<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useRoomStore } from '@/store/room'

const model = true;
const invitationId = useRoute().params.id as string;
const roomStore = useRoomStore();

// getting invitation
console.log(invitationId);
roomStore.getInvitation(invitationId).then(result => {
  console.log(result)
}).catch((error: any) => {
    console.log(error);
  });

</script>

<template>
  <v-main>
    <v-dialog  v-model="model" overlay-color="black">
    <v-card max-width="600" class="mx-auto">
      <v-card-text>
        invitation for room
      </v-card-text>
      <v-card-actions>
        <v-btn>accept</v-btn>
        <v-btn>decline</v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>
  </v-main>
</template>
