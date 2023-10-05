<script setup lang="ts">
import { useInvitationStore } from '@/store/invitation';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { ref } from 'vue';
import { resetObject } from '@/composables/helpers';

const router = useRouter();
const route = useRoute();;
const invitationStore = useInvitationStore();
const { invitation } = storeToRefs(invitationStore);
const loading = ref(false);

// watching route change
onBeforeRouteUpdate((to) => {
  getData(to.params.id as string);
});

const errorMessage = ref('');

const handleAccept = () => {
  loading.value = true;
  invitationStore.acceptInvitation(invitation.value.id).then((result: any) => {
    if (invitation.value.type === 'GAME')
    router.push({name: 'Game'});
  }).catch((error: any) => {

    });
}

const handleDecline = () => {
  loading.value = true;
  invitationStore.declineInvitation(invitation.value.id).then(() => {
    loading.value = false;
    back();
  }).catch(() => {
    loading.value = false;
  });
}

const getData = (invitId: string) => {
  resetObject(invitation.value);
  loading.value = true;
  invitationStore.getInvitation(invitId).then((result) => {
    loading.value = false;
  }).catch((error:any) => {
    errorMessage.value = error?.data?.message
    loading.value = false;
});
}

const back = () => {
  router.go(-1);
}

// getting data
getData(route.params.id as string);

</script>

<template>
  <v-main class="the-main vh-100">
      <v-card :loading="loading" bg-color="colorOne" class="pa-5 ma-4" rounded="xl" variant="outlined" color="colorTwo">
      <div v-if="invitation.id">
          <v-card-text>
          {{ invitation.notification?.content}}
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
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
  </v-main>
</template>


<style lang="scss">

.container {
  height: 100%;
  width: 100%;
}

.the-main {
  background-color: rgb(var(--v-theme-colorOne));
}
.vh-100 {
  height: 100vh;
}
</style>
