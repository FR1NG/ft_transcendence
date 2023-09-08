<script lang="ts" setup>
import { ref } from 'vue';
import axios from '@/plugins/axios'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useChatStore } from '@/store/chat'
import { storeToRefs } from 'pinia';
import { useSocketStore } from '@/store/socket'
import { bootstrap } from '@/composables/socket';
import AppBar from '../default/AppBar.vue';
import OContainer from './parcials/OContainer.vue'
import RoomsList from './parcials/RoomsList.vue'
import InfoBar from './parcials/InfoBar.vue'
import MessageInput from './parcials/MessageInput.vue'
import UsersList from './parcials/UsersList.vue'
import RoomSettings from './parcials/room/RoomSettings.vue'
import { useRoomStore } from '@/store/room';

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
const onlineUsers: any = ref([]);

const getConversation = async (id: string, type: string) => {
  chatStore.getConversation(id, type);
}

getConversation(route.params.id as string, route.name?.toString().toLowerCase() as string);


onBeforeRouteUpdate((to) => {
  const { id } = to.params;
  type.value = to.name?.toString().toLowerCase() as Type;
  getConversation(id as string, type.value);
})

// leave room cleanup
const handleLeaveRoom = () => {
  roomSettings.value = false;
  chatStore.deleteConversation(route.params.id as string);
  roomStore.getRooms();
}

</script>

<template>
    <room-settings v-if="roomSettings" @leave="handleLeaveRoom"> </room-settings>
    <o-container :messages="messages"></o-container>
    <message-input v-model="message" :disabled="selectedUser?.block" @send="send"> </message-input>
</template>
