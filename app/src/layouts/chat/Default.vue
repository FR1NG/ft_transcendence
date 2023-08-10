
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
import DefaultSidBar from '../default/SideBar.vue'
import RoomsList from './parcials/RoomsList.vue'
import type { User } from '@/types/user';

const message = ref('');
const route = useRoute();
const chatStore = useChatStore();
const snackBarStore = useSnackBarStore();
const roomStore = useRoomStore();
const { activeConversation: messages, selectedUser  } = storeToRefs(chatStore);
const usersDrawer = ref(true)
const {drawer: roomsDrawer } = storeToRefs(roomStore)


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
const send = () => {
  if (message.value.length > 0) {
    const recieverId: string = route.params.id as string;
    socket.emit('message', {content: message.value, recieverId, type: 'dm'})
    // TODO should listen for an event to give the feedback of the message and get the id from it
    const sentMessage: Message = {
      content: message.value,
      type: 'sent',
      id: 'somerandomid'
    }

    chatStore.addMessageToConversation(sentMessage, recieverId);
    message.value = '';
  }
}

// TODO add a type to the data
socket.on('message', (data: any) => {
  chatStore.playNotificationSound();
  const {id, content, senderId } = data;
  const message : Message = {
    id,
    content,
    type: 'recieved'
  };
  const conversation = chatStore.addMessageToConversation(message, senderId);
  console.log(conversation?.user)
  showNotification(message, conversation?.user);
})

// show notification
const showNotification = (message: Message, user: User | undefined) => {
  snackBarStore.notify(message.content, user?.username)
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

const getUsersConversation = async (id: string) => {
  chatStore.getUsersConversation(id);
}

getUsersConversation(route.params.id as string);

getOnlineUsers();

fetch();

onBeforeRouteUpdate((to) => {
  const { id }  = to.params;
  getUsersConversation(id as string)
})

const handleEnter = () => {
  send()
}

</script>

<template>
  <v-app id="inspire">
    <app-bar></app-bar>
    <DefaultSidBar/>
    <v-navigation-drawer color="grey-lighten-3" :rail='false' v-model="usersDrawer">
      <v-avatar class="d-block text-center mx-auto mt-4" color="grey-darken-1" size="36"></v-avatar>
      <v-divider class="mx-3 my-5"></v-divider>

      <v-list>

        <v-list-item  v-for='user in users' :key="user.id" :title="user.username" :prependAvatar="user.avatar"
          :to="{ name: 'Dm', params: { id: user.id } }" :value='user.username'>
      <v-badge dot :color="user.isOnline ? `success` : `secondary`" inline>
      </v-badge>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="px-3" color="grey-lighten-4" flat height="72">
      <v-btn icon="mdi-menu-open" @click="usersDrawer = !usersDrawer"></v-btn>
      <v-badge dot :color="selectedUser.isOnline ? `success` : `secondary`" inline>
      <v-list-item v-if="selectedUser.username" color="primary"  :title="selectedUser.username" :prependAvatar="selectedUser.avatar"
        :to="{name: 'UserProfile', params: {username: selectedUser.username}}" :value='selectedUser.username'>
        </v-list-item>
      </v-badge>
      <v-spacer></v-spacer>

      <v-responsive max-width="156">
        <v-text-field bg-color="grey-lighten-2" class="rounded-pill overflow-hidden" density="compact" hide-details
          variant="solo"></v-text-field>
      </v-responsive>
      <v-btn icon="mdi-menu-open" @click="roomsDrawer = !roomsDrawer"></v-btn>
    </v-app-bar>

    <v-main>
      <!-- messages container -->
      <o-container :messages="messages"></o-container>
    </v-main>
    <!-- rooms list component -->
    <rooms-list :appearance="roomsDrawer"> </rooms-list>

    <v-footer app height="72">
      <v-text-field bg-color="grey-lighten-1" class="rounded-pill overflow-hidden" density="compact" hide-details
        variant="solo" v-model="message" append-inner-icon="mdi-send-circle-outline"
        @click:append-inner="send" @keyup.enter="handleEnter"></v-text-field>
    </v-footer>
  </v-app>
</template>
