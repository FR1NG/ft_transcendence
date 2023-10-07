<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useRoomStore } from '@/store/room'
import { ref } from 'vue'
import { pushNotify } from '@/composables/simpleNotify';

const model = ref(true);
const invitationId = useRoute().params.id as string;
const roomStore = useRoomStore();
const appearance = ref(false);
const errorMessage = ref('');
const data = ref();
const loading = ref(false);
const router = useRouter();

// getting invitation
roomStore.getInvitation(invitationId).then(result => {
  data.value = result
  appearance.value = true;
}).catch((error: any) => {
  appearance.value = false;
  errorMessage.value = error?.data?.message
});

// accepting the invitation
const handleAccept = () => {
  loading.value = true;
  roomStore.acceptInvitation(invitationId).then(() => {
    loading.value = false;
    router.push({ name:  'Room', params: { id: data.value.byId }});
  }).catch(() => {
    loading.value = false;
  });
}

const handleDecline = () => {
  loading.value = true;
  roomStore.declineInvitation(invitationId).then(() => {
    loading.value = false;
    router.push({name: 'Home'});
  }).catch(() => {
    loading.value = false;
  });
}


</script>

<template>
  <v-main>
    <v-dialog v-model="model" class="overlay">
      <v-card width="400" class="mx-auto pa-4" color="colorThree text-colorOne"  rounded="xl" :loading="loading">
        <div v-if="appearance">
          <v-card-text>
            invitation to join room: {{ data.inviter.name }}
          </v-card-text>
          <v-card-actions>
            <v-btn @click="handleAccept" :disabled="loading">accept</v-btn>
            <v-btn @click="handleDecline" :disabled="loading">decline</v-btn>
          </v-card-actions>
        </div>
        <div v-else>
          <v-card-text>
            {{ errorMessage }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="outlined" :to="{name: 'Home'}" prepend-icon="mdi-home-outline">Home</v-btn>
          </v-card-actions>
        </div>

      </v-card>
    </v-dialog>
  </v-main>
</template>
