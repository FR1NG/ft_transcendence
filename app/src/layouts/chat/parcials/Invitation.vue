<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useRoomStore } from '@/store/room'
import { ref } from 'vue'
import { pushNotify } from '@/composables/simpleNotify';

const model = true;
const invitationId = useRoute().params.id as string;
const roomStore = useRoomStore();
const appearance = ref(false);
const errorMessage = ref('');
const data = ref();
const loading = ref(false);
const router = useRouter();

// getting invitation
console.log(invitationId);
roomStore.getInvitation(invitationId).then(result => {
  data.value = result
  appearance.value = true;
}).catch((error: any) => {
  pushNotify({status:'error', title:'error', text:error.data.message})
  appearance.value = false;
  errorMessage.value = error?.data?.message
});

// accepting the invitation
const handleAccept = () => {
  loading.value = true;
  roomStore.acceptInvitation(invitationId).then(() => {
    loading.value = false;
    console.log('by id: ',data.value.byId);
    router.push({ name:  'Room', params: { id: data.value.byId }});
    pushNotify({status:'success', title:'Action completed', text:'room joined successfully'})
  }).catch(() => {
    pushNotify({status:'error', title:'error', text:"error while accepting the invitation"})
    loading.value = false;
  });
}

const handleDecline = () => {
  loading.value = true;
  roomStore.declineInvitation(invitationId).then(() => {
    loading.value = false;
    router.go(-1);
  }).catch(() => {
    pushNotify({status:'error', title:'error', text:"error while accepting the invitation"})
    loading.value = false;
  });
}

const back = () => {
  router.go(-1)
}

</script>

<template>
  <v-main>
    <v-dialog v-model="model" overlay-color="black">
      <v-card max-width="600" class="mx-auto" :loading="loading">
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
          <v-card-actions class="d-flex justify-center">
            <v-btn variant="outlined" @click="back" prepend-icon="mdi-home-outline">Home</v-btn>
          </v-card-actions>
        </div>

      </v-card>
    </v-dialog>
  </v-main>
</template>
