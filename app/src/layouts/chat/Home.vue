<script lang="ts" setup>
import { ref } from 'vue';
import axios from '@/plugins/axios'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useChatStore } from '@/store/chat'
import { storeToRefs } from 'pinia';
import { useSocketStore } from '@/store/socket'
import { bootstrap } from '@/composables/socket';
import AppBar from '../default/AppBar.vue';
import RoomsList from './parcials/RoomsList.vue'
import InfoBar from './parcials/InfoBar.vue'
import UsersList from './parcials/UsersList.vue'
import { useRoomStore } from '@/store/room';
import { RouterView } from 'vue-router';

// bootstrapping the socket if not initialized on home  component
bootstrap();

const message = ref('');
const route = useRoute();
const chatStore = useChatStore();
const socketStore = useSocketStore();
const roomStore = useRoomStore();
const { activeConversation: messages, selectedUser, selectedRoom } = storeToRefs(chatStore);
const { roomSettings } = storeToRefs(roomStore)
const drawer = ref(true)

// type of the conversation (dm / room)
type Type = 'dm' | 'room';
const type = ref(route.name?.toString().toLowerCase() as Type);

const send = () => {
  if (message.value.length === 0)
    return;
  const recieverId: string = route.params.id as string;
  const sentMessage = socketStore.sendMessage(message.value, recieverId, type.value, (data: any) => {
  if(type.value === 'dm')
    chatStore.changeMessageStatus(data);
  });
  if (type.value === 'dm')
    chatStore.addMessageToConversation(sentMessage, recieverId);
  message.value = '';
}
// for test
const users: any = ref([]);

const fetch = async () => {
  try {
    const response: any = await axios.get('/user');
    users.value = response.data;
  } catch (error) {
    console.log(error)
  }
}
fetch();

onBeforeRouteUpdate((to) => {
  chatStore.resetActiveConversation();
  const { id } = to.params;
  type.value = to.name?.toString().toLowerCase() as Type;
  // getConversation(id as string, type.value);
})

const tab = ref(type.value);
</script>

<template>
  <v-app id="inspire">
    <app-bar></app-bar>
    <v-navigation-drawer color="colorTwo" :rail='false' v-model="drawer">
      <v-tabs v-model="tab" color="colorOne" align-tabs="center">
        <v-tab value="dm">messages</v-tab>
        <v-tab value="room">rooms</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="dm">
          <users-list :users="users"> </users-list>
        </v-window-item>
        <v-window-item value="room">
          <rooms-list> </rooms-list>
        </v-window-item>
      </v-window>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
      <info-bar @click:menu="drawer = !drawer" :user="selectedUser" :room="selectedRoom" :type="type"></info-bar>
    </v-main>
  </v-app>
</template>
