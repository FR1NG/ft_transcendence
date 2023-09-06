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

const init = (): boolean => {
  return socketStore.init(import.meta.env.DOMAIN, {
    auth: {
      token: sessionStorage.getItem('access_token'),
    }
  });
}

const listen = () => {
  socketStore.listen((event: string, data: any) => {
    if (event === 'message') {
      data["loading"] = false;
      chatStore.addMessageToConversation(data, data.sender.id);
      showNotification(data.content, data.sender.username);
      console.log('new message from user');
    }
    else if (event === 'room-message') {
      const { room } = data;
      data["loading"] = false;
      chatStore.addMessageToConversation(data, room.id);
      if (data.sender.id !== me.value.id)
        showNotification(data.content, `${data.sender.username}#${room.name}`);
      console.log('new message from room');
    }
    else if(event === 'notification') {
      showNotification(data.content, data.content);
    }

  }, error => {
    console.log('you got new error on the socket')
    console.log(error);
  });
}

const showNotification = (content: string, title: string) => {
  snackBarStore.notify(content, title);
  chatStore.playNotificationSound();
}

// bootstaping socket
export const bootstrap = () => {
  if(init()) {
    listen();
  }
}
