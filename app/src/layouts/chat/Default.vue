
<script lang="ts" setup>
import AppBar from '../default/AppBar.vue';
import { ref } from 'vue';
import { io } from 'socket.io-client';
import axios from '@/plugins/axios'
import OContainer from './parcials/OContainer.vue'
import type { Message } from '@/types/chat';
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

const message = ref('');
const route = useRoute()


const messages = ref<Message[]>(
  [
    { type: 'sent', content: 'hello my friend' },
    { type: 'recieved', content: 'hi how are you' },
    { type: 'sent', content: 'im doing great' },
    { type: 'sent', content: 'how about you' },
    { type: 'recieved', content: 'me too' },
    { type: 'sent', content: 'thats great' },
    { type: 'recieved', content: 'thank you' },
  ]
)



const socket = io('https://game.hchakoub.codes', {
  query: {
    token: sessionStorage.getItem('access_token'),
  },
  auth: {
    token: sessionStorage.getItem('access_token'),
  }
});

console.log('trying to connect to socket server')
socket.emit('connection', 'hello server');
socket.on('connected', function () {
  console.log('socket connected');
  socket.emit('message', 'hi server how are you')
})
const send = () => {
  if (message.value.length > 0) {
    const recieverId = route.params.id
    socket.emit('message', {content: message.value, recieverId, type: 'dm'})
    messages.value.push({
      content: message.value,
      type: 'sent',
      // loading: true
    })
    message.value = '';
  }
}

socket.on('message', (message: string) => {
  const dm: Message = {
    type: 'recieved',
    content: message ,
  };

  messages.value.push(dm);

})

// for test
const users: any = ref([]);
const onlineUsers: any = ref([]);

const fetch = async () => {
  try {
    const response: any = await axios.get('/user');
    console.log(response.data)
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
  if(!id)
    return;
  try {
    console.log(`this is the id: ${id}`)
    const { data } = await axios.get(`/chat/user-conversation/${id}`);
    messages.value = data;
  }catch (error) {
    console.log('error whene getting messages');
    console.log(error)
  }
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
    <v-navigation-drawer color="grey-lighten-3" :rail='false'>
      <v-avatar class="d-block text-center mx-auto mt-4" color="grey-darken-1" size="36"></v-avatar>
      <v-divider class="mx-3 my-5"></v-divider>

      <v-list>
        <v-list-item v-for='user in users' :key="user.id" :title="user.username" :prependAvatar="user.avatar"
          :to="{ name: 'Dm', params: { id: user.id } }" :value='user.username'>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer width="244">
      <v-sheet color="grey-lighten-5" height="128" width="100%"></v-sheet>

      <v-list>
        <!-- online users -->
        <v-list-item v-for='user in onlineUsers' :key="user.id" :title="user.username" :prependAvatar="user.avatar"
          :to="{ name: 'Dm', params: { id: user.id } }" :value='user.username'>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="px-3" color="grey-lighten-4" flat height="72">
      <v-spacer></v-spacer>

      <v-responsive max-width="156">
        <v-text-field bg-color="grey-lighten-2" class="rounded-pill overflow-hidden" density="compact" hide-details
          variant="solo"></v-text-field>
      </v-responsive>
    </v-app-bar>

    <v-main>
      <!-- messages container -->
      <o-container :messages="messages"></o-container>
    </v-main>

    <v-navigation-drawer location="right">
      <v-list>
        <v-list-item v-for="n in 5" :key="n" :title="`Item ${n}`" link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-footer app height="72">
      <v-text-field bg-color="grey-lighten-1" class="rounded-pill overflow-hidden" density="compact" hide-details
        variant="solo" v-model="message" append-inner-icon="mdi-send-circle-outline"
        @click:append-inner="send" @keyup.enter="handleEnter"></v-text-field>
    </v-footer>
  </v-app>
</template>

