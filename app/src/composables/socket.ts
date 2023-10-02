import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app'
import { useAuthStore } from '@/store/auth';
import { useSocketStore } from '@/store/socket';
import { useChatStore } from '@/store/chat';
import { pushNotify } from './simpleNotify';
import { useRoute } from 'vue-router';


const init = (): boolean => {
  const socketStore = useSocketStore();
  const { domain, api_url } = storeToRefs(useAppStore());
  return socketStore.init(`${domain.value}`, {
    auth: {
      token: useAuthStore().getToken(),
    }
  });
}

const listen = () => {

  const authStore = useAuthStore();
  const socketStore = useSocketStore();
  const chatStore = useChatStore();
  const { me } = storeToRefs(authStore);

  socketStore.listen((event: string, data: any) => {
    if (event === 'message') {
      data["loading"] = false;
      chatStore.addMessageToConversation(data, data.sender.id, 'dm');
      showNotification(data.content, data.sender.username);
    }
    else if (event === 'room-message') {
      const { room } = data;
      data["loading"] = false;
      chatStore.addMessageToConversation(data, room.id, 'room');
      if (data.sender.id !== me.value.id)
        showNotification(data.content, `${data.sender.username}#${room.name}`);
    }
    else if(event === 'notification') {
      showNotification(data.content, data.content);
    }

  }, (error: any) => {
      pushNotify({status:'error', title:'error', text:error.toString()})
  });
}

const showNotification = (content: string, title: string) => {
  const chatStore = useChatStore();
  pushNotify({status:'info', title:title, text:content})
  chatStore.playNotificationSound();
}

// bootstaping socket
export const bootstrap = () => {
  if(init()) {
    listen();
  }
}
