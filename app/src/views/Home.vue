<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app'
import { useAuthStore } from '@/store/auth';
import { useSocketStore } from '@/store/socket';
import { useChatStore } from '@/store/chat';
import { useSnackBarStore } from '@/store/snackbar'

const appStore = useAppStore();
const authStore = useAuthStore();
const socketStore = useSocketStore();
const chatStore = useChatStore();
const snackBarStore = useSnackBarStore();
const { me } = storeToRefs(authStore);
appStore.getInitialData();
authStore.getMe();

socketStore.init(import.meta.env.DOMAIN, {
  auth: {
    token: sessionStorage.getItem('access_token'),
  }
});

socketStore.listen((event: string, data: any) => {
  if(event === 'message') {
    data["loading"] = false;
    chatStore.addMessageToConversation(data, data.sender.id);
    showNotification(data.content, data.sender.username);
    console.log('new message from user');
  } else if (event === 'room-message') {

    const { room } = data;
    data["loading"] = false;
    chatStore.addMessageToConversation(data, room.id);
    if(data.sender.id !== me.value.id)
      showNotification(data.content, `${data.sender.username}#${room.name}`);
    console.log('new message from room');
  }

}, error => {
      console.log('you got new error on the socket')
      console.log(error);
  });

const showNotification = (content: string, title: string) => {
  snackBarStore.notify(content, title);
  chatStore.playNotificationSound();
}
</script>
<template>
    <v-card min-height="400"  class="ma-4 pa-0" rounded="xl" elevation="10"  border="0" backgound="#DA032B">
      <!-- <img  class="ppong-image" alt="main image" src="/images/ppong.gif"/> -->
    </v-card>
</template>

<script lang="ts" setup>
</script>

<style>
.ppong-image {
  width: 100%;
  margin-top: -350px;

}
</style>
