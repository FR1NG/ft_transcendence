<script lang="ts" setup>
import { ref } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useChatStore } from '@/store/chat'
import { storeToRefs } from 'pinia';
import { useSocketStore } from '@/store/socket'
import { bootstrap } from '@/composables/socket';
import OContainer from './parcials/OContainer.vue'
import MessageInput from './parcials/MessageInput.vue'
import RoomSettings from './parcials/room/RoomSettings.vue'
import { useRoomStore } from '@/store/room';

// bootstrapping the socket if not initialized on home  component
bootstrap();

const message = ref('');
const route = useRoute();
const chatStore = useChatStore();
const socketStore = useSocketStore();
const roomStore = useRoomStore();
const { activeConversation: messages, selectedUser } = storeToRefs(chatStore);
const { roomSettings } = storeToRefs(roomStore)

// type of the conversation (dm / room)
type Type = 'dm' | 'room';
const type = ref(route.name?.toString().toLowerCase() as Type);
let chatId = route.params.id as string;

const send = () => {
  if (message.value.length === 0)
    return;
  // const recieverId: string = route.params.id as string;
  const sentMessage = socketStore.sendMessage(message.value, chatId, type.value, (data: any) => {
  if(type.value === 'dm')
    chatStore.changeMessageStatus(data);
  });
  if (type.value === 'dm')
    chatStore.addMessageToConversation(sentMessage, chatId, 'dm');
  message.value = '';
}

const getConversation = async (id: string, type: string) => {
  chatStore.getConversation(id, type);
}

getConversation(chatId, type.value);


onBeforeRouteUpdate((to) => {
  const { id } = to.params;
  chatId = id as string;
  type.value = to.name?.toString().toLowerCase() as Type;
  getConversation(chatId, type.value);
})

onBeforeRouteLeave((to) => {
  const { id } = to.params;
  chatId = id as string;
  type.value = to.name?.toString().toLowerCase() as Type;
  getConversation(chatId, type.value);
})

// leave room cleanup
const handleLeaveRoom = () => {
  roomSettings.value = false;
  chatStore.deleteConversation(route.params.id as string);
  roomStore.getRooms();
}

const focus = () => {
  chatStore.markRead(chatId);
}

</script>

<template>
    <room-settings v-if="roomSettings" @leave="handleLeaveRoom"> </room-settings>
    <o-container :messages="messages"></o-container>
    <message-input v-model="message" :disabled="selectedUser?.block" @send="send" @focus="focus"> </message-input>
</template>
