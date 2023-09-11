<script lang="ts" setup>
import { useRoomStore } from '@/store/room';
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { RoomDetails, Room } from '@/types/room'
import { iconColor, getIcon } from '@/composables/room'
import { useAuthStore } from '@/store/auth';
import Confirm from '@/components/Confirm.vue'
import CostumDivider from '@/components/CustomDivider.vue'
import EditRoom from './EditRoom.vue'
import router from '@/router';
import { useSnackBarStore } from '@/store/snackbar';
import InviteUser from './InviteUser.vue'


const dialog = true;
const roomStore = useRoomStore()
const { roomSettings } = storeToRefs(roomStore);
const authStore = useAuthStore();
const { me } = storeToRefs(authStore);
const route = useRoute();
const usersId = ref<Array<String>>();
const invitedsId = ref<Array<String>>();

const roomId: string = route.params.id as string;
const data = reactive({
  loading: false
});
const showEdit = ref(false);
const showInvite = ref(false);

// events emits
const emit = defineEmits(['leave']);

const details = ref<RoomDetails>();
const getData = async () => {
  // TODO some error will be placed here
  if (!roomId)
    return;
  try {
    data.loading = true;
    details.value = await roomStore.getRoomDetails(roomId) as RoomDetails;
    usersId.value = details.value.room.users.map(el => el.user.id);
    invitedsId.value = details.value.room.invitedUsers.map(el => el.id);
    data.loading = false;
  } catch (error: any) {
    data.loading = false;
    console.log(error);
  }
}

getData();

// option actions
const makeAdmin = async (id: string) => {
  try {
    const result = await roomStore.addAdmin(roomId, id);
    getData();
  } catch (error: any) {
    alert(error.data.message);
  }
}

const removeAdmin = async (id: string) => {
  try {
    const result = await roomStore.removeAdmin(roomId, id);
    getData();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

const kick = async (id: string) => {
  try {
    const result = await roomStore.kickUser(roomId, id);
    getData();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

const ban = async (id: string) => {
  try {
    const result = await roomStore.banUser(roomId, id);
    getData();
    console.log(result);
  } catch (error) {
    console.log(error);
  }

}

// leave a room

const leaveDialog = ref(false);

const leave = async (callback: () => void, handleError: () => void) => {
  try {
    const result = await roomStore.leaveRoom(roomId);
    console.log(result);
    callback();
    emit('leave');
    router.push({ name: 'Chat' })
  } catch (error) {
    console.log(error)
    handleError();
  }
}

// handle on room updated
const onRoomUpdated = () => {
  showEdit.value = false;
  useSnackBarStore().notify('room updated successfully');
  getData();
}

</script>

<template>
  <v-dialog width="800" v-model="dialog" persistent>
    <v-card :loading="data.loading">
      <v-toolbar color="colorOne">
        <v-toolbar-title>
          {{ details?.room.name }}
        </v-toolbar-title>
        <v-card-subtitle>
          {{ details?.room.type }}
        </v-card-subtitle>
        <template v-slot:append >
          <v-btn icon @click="showEdit = !showEdit" v-if="details?.role === 'OWNER'">
            <v-icon>mdi-pencil-box-outline</v-icon>
          </v-btn>
          <v-btn icon @click="showInvite = !showInvite"  v-if="details?.role === 'ADMIN' || details?.role === 'OWNER'">
            <v-icon>mdi-account-plus-outline</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-expand-transition>
        <invite-user :refetch="getData" :users-id="usersId" :inviteds-id="invitedsId" v-if="showInvite"> </invite-user>
      </v-expand-transition>
      <v-expand-transition>
        <edit-room v-if="showEdit" :room="details.room" @update="onRoomUpdated"> </edit-room>
      </v-expand-transition>
      <v-card-text>
        <costum-divider title="Room users"> </costum-divider>
        <v-list max-height="300">
          <v-list-item v-for="user in details?.room.users" :key="user.user.id">
            <v-list-item-title>{{ user.user.id === me.id ? `${user.user.username} (you)` : user.user.username
            }}</v-list-item-title>
            <v-list-item-subtitle> {{ user.role }} </v-list-item-subtitle>
            <template v-slot:prepend>
              <v-icon v-if="user.role !== 'USER'" class="role-icon" :color="iconColor(user.role)">
                {{ getIcon(user.role) }}
              </v-icon>
              <v-avatar>
                <v-img :src="user.user.avatar"></v-img>
              </v-avatar>
            </template>

            <template v-if="user.user.id !== me.id && user.role != 'OWNER' && details?.role !== 'USER'" v-slot:append>
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
        <v-divider></v-divider>
        <Confirm @confirm="leave" v-model="leaveDialog" title="Leave room"
          text="Are you sure you want to leave this room" />
        <v-btn block color="error" variant="outlined" @click="leaveDialog = true">leave room</v-btn>
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
