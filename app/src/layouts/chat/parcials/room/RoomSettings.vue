<script lang="ts" setup>
import { useRoomStore } from '@/store/room';
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { RoomDetails } from '@/types/room'
import { iconColor, getIcon } from '@/composables/room'
import { useAuthStore } from '@/store/auth';


const dialog = true;
const roomStore = useRoomStore()
const { roomSettings } = storeToRefs(roomStore);
const authStore = useAuthStore();
const { me } = storeToRefs(authStore);
const route = useRoute();

const roomId: string = route.params.id as string;
const data = reactive({
  loading: false
});

const details = ref<RoomDetails>();
const created = async () => {
  // TODO some error will be placed here
  if (!roomId)
    return;
  try {
    data.loading = true;
   details.value = await roomStore.getRoomDetails(roomId) as RoomDetails;
    data.loading = false;
  } catch (error: any) {
    data.loading = false;
    console.log(error);
  }
}

created();

// option actions
const makeAdmin = async (id: string) => {
  try {
    const result = await roomStore.addAdmin(roomId, id);
    created();
  } catch (error: any) {
    alert(error.data. message);
  }
}

const removeAdmin = async (id: string) => {
  try {
    const result = await roomStore.removeAdmin(roomId, id);
    created();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

const kick = async (id: string) => {
  try {
    const result = await roomStore.kickUser(roomId, id);
    created();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

const ban = async (id: string) => {
  try {
    const result = await roomStore.banUser(roomId, id);
    created();
    console.log(result);
  } catch (error) {
    console.log(error);
  }

}

// leave a room

const leave = async () => {
  try {
    const result = await roomStore.leaveRoom(roomId);
    console.log(result);
  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  <v-dialog width="800" v-model="dialog" persistent>
    <v-card :loading="data.loading">
      <v-card-title>
        {{ details?.room.name }}
      </v-card-title>
      <v-card-subtitle>
        {{ details?.room.type }}
      </v-card-subtitle>
      <v-card-text>
        <v-list max-height="300">
          <v-list-item v-for="user in details?.room.users" :key="user.user.id">
            <v-list-item-title>{{ user.user.id === me.id ? `${user.user.username} (you)` : user.user.username }}</v-list-item-title>
            <v-list-item-subtitle> {{ user.role }} </v-list-item-subtitle>
            <template v-slot:prepend>
              <v-icon v-if="user.role !== 'USER'" class="role-icon" :color="iconColor(user.role)">
                {{ getIcon(user.role)}}
              </v-icon>
              <v-avatar>
                <v-img :src="user.user.avatar"></v-img>
              </v-avatar>
            </template>

            <template v-if="user.user.id !== me.id && user.role != 'OWNER' && details?.role !== 'USER'"  v-slot:append>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">mdi-dots-vertical</v-icon>
                </template>
                <v-list>
                  <v-list-item v-if="user.role !== 'ADMIN'" @click="makeAdmin(user.user.id)">Make Admine</v-list-item>
                  <v-list-item v-else @click="removeAdmin(user.user.id)">Remove Admine</v-list-item>
                  <v-list-item @click="ban(user.user.id)">Ban</v-list-item>
                  <v-list-item @click="kick(user.user.id)">Kick</v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-list-item>
        </v-list>
        <v-divider ></v-divider>
        <v-btn block color="error" variant="outlined" @click="leave">leave room</v-btn>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="roomSettings = false">close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
  .role-icon {
    position: absolute;
    z-index: 1000;
    top: 3px;
    left: 3px;
    rotate: 330deg;
    opacity: 1 !important;
    background: rgb(var(--v-theme-colorOne));
    border-radius: 50%;
  }
</style>
