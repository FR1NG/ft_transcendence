
<script lang="ts" setup>
import AppBar from '../default/AppBar.vue';
import { ref } from 'vue';
import { io } from 'socket.io-client';
import axios from '@/plugins/axios'
import OContainer from './parcials/OContainer.vue'
import type { Message } from '@/types/chat';
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useChatStore } from '@/store/chat'
import { storeToRefs } from 'pinia';
import { useSnackBarStore } from '@/store/snackbar'
import { useRoomStore } from '@/store/room'
import RoomsList from './parcials/RoomsList.vue'
import type { User } from '@/types/user';
import { Room } from '@/types/room';

const message = ref('');
const route = useRoute();
const chatStore = useChatStore();
const snackBarStore = useSnackBarStore();
const roomStore = useRoomStore();
const { activeConversation: messages, selectedUser } = storeToRefs(chatStore);
const usersDrawer = ref(true)
const { drawer: roomsDrawer } = storeToRefs(roomStore)


const socket = io(import.meta.env.DOMAIN, {
  query: {
    token: sessionStorage.getItem('access_token'),
  },
  auth: {
    token: sessionStorage.getItem('access_token'),
  }
});

socket.on('error', (data) => {
  snackBarStore.notify(data)
})

// message feedback from the backed
socket.on('feedback', (data) => {
  chatStore.changeMessageStatus(data);
})

const send = () => {

  if (message.value.length === 0)
    return;

  const recieverId: string = route.params.id as string;
  const type = route.name?.toString().toLowerCase();
  const tmpId = Math.random().toString();
  socket.emit('message', { content: message.value, recieverId, type, id: tmpId })
  // TODO should listen for an event to give the feedback of the message and get the id from it
  const sentMessage: Message = {
    content: message.value,
    type: 'sent',
    id: tmpId,
    loading: true
  }

  if (type === 'dm')
    chatStore.addMessageToConversation(sentMessage, recieverId);
  message.value = '';
}

// TODO add a type to the data
socket.on('message', (data: any) => {
  chatStore.playNotificationSound();
  const { id, content, senderId } = data;
  const message: Message = {
    id,
    content,
    type: 'recieved',
    loading: false
  };
  const conversation = chatStore.addMessageToConversation(message, senderId);
  showNotification(message, conversation?.user.username as string);
})

socket.on('room-message', (data: any) => {
  chatStore.playNotificationSound();
  const { id, content, senderId, sender, room } = data;
  const message: Message = {
    id,
    content,
    type: 'recieved',
    loading: false
  };
  console.log(data);
  chatStore.addMessageToConversation(message, room.id);
  showNotification(message, `${sender.username}#${room.name}`);
});

// show notification
const showNotification = (message: Message, sender: string) => {
  snackBarStore.notify(message.content, sender)
}

// for test
const users: any = ref([]);
const onlineUsers: any = ref([]);

const fetch = async () => {
  try {
    const response: any = await axios.get('/user');
    users.value = response.data;
  } catch (error) {
    console.log(error)
  }
}

const getOnlineUsers = async () => {
  try {
    const { data } = await axios.get('/friend/online');
    onlineUsers.value = data;
  } catch (error) {
    console.log(error)
  }
}

const getConversation = async (id: string, type: string) => {
  chatStore.getConversation(id, type);
}

getConversation(route.params.id as string, route.name?.toString().toLowerCase() as string);

getOnlineUsers();

fetch();

const type = ref('');
onBeforeRouteUpdate((to) => {
  const { id } = to.params;
  type.value = to.name?.toString().toLowerCase() as string;
  getConversation(id as string, type.value);
})

const handleEnter = () => {
  send()
}

const tab = ref();
</script>

<template>
  <v-app id="inspire">
    <app-bar></app-bar>
    <v-navigation-drawer color="colorTwo" :rail='false' v-model="usersDrawer">
      <v-tabs v-model="tab" color="colorOne" align-tabs="center">
        <v-tab :value="1">messages</v-tab>
        <v-tab :value="2">rooms</v-tab>
      </v-tabs>

      <v-window v-model="tab">

        <v-window-item :value="1">
          <v-list>
            <v-list-item v-for='user in users' :key="user.id" :title="user.username" :prependAvatar="user.avatar"
              :to="{ name: 'Dm', params: { id: user.id } }" :value='user.username'>
              <v-badge dot :color="user.isOnline ? `success` : `secondary`" inline>
              </v-badge>
            </v-list-item>
          </v-list>
        </v-window-item>
        <v-window-item :value="2">
          <!-- rooms list component -->
          <rooms-list :appearance="roomsDrawer"> </rooms-list>
          <!-- end rooms list component -->
        </v-window-item>
      </v-window>
      <!-- <v-avatar class="d-block text-center mx-auto mt-4" color="grey-darken-1" size="36"></v-avatar> -->
      <!-- <v-divider class="mx-3 my-5"></v-divider> -->

    </v-navigation-drawer>
    <!-- end  of users conversations -->



    <v-app-bar class="px-3" color="colorThree" flat height="72">
      <v-btn icon="mdi-menu" color="colorOne" @click="usersDrawer = !usersDrawer"></v-btn>
      <v-badge v-if="type === 'dm'" dot :color="selectedUser.isOnline ? `success` : `secondary`" inline>
        <v-list-item v-if="selectedUser.username" color="primary" :title="selectedUser.username"
          :prependAvatar="selectedUser.avatar" :to="{ name: 'UserProfile', params: { username: selectedUser.username } }"
          :value='selectedUser.username'>
        </v-list-item>
      </v-badge>
      <v-badge color="colorThree" v-else>this is a room</v-badge>
      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <!-- messages container -->
      <o-container :messages="messages"></o-container>
    </v-main>

    <v-footer app height="72">
      <v-text-field :disabled="selectedUser.block" bg-color="colorThree" class="overflow-hidden"
        density="compact" hide-details variant="solo" v-model="message"
        @click:append-inner="send" @keyup.enter="handleEnter">
        <template v-slot:append-inner>
<!-- append-inner-icon="mdi-send-circle-outline" -->
          <v-icon color="colorTwo">
            mdi-send-circle-outline
          </v-icon>
         </template>
      </v-text-field>
    </v-footer>
  </v-app>
</template>
