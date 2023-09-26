
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app'
import { useAuthStore } from '@/store/auth';
import { useSocketStore } from '@/store/socket';
import { useChatStore } from '@/store/chat';
import { useSnackBarStore } from '@/store/snackbar'
import { useGameStore } from '@/store/game';

const init = (): boolean => {
  const socketStore = useSocketStore();
  return socketStore.initGameSocket(`http://10.14.6.6:4443/game`, {
    auth: {
      token: sessionStorage.getItem('access_token'),
    }
  });
}

const listen = () => {
  const socketStore =  useSocketStore()
  const { gameSocket } = storeToRefs(socketStore);
  const gameStore = useGameStore();

  gameSocket.value?.on('game-result' , (data) => {
    gameStore.setResult(data.result);
    gameStore.setRestartId(data.restartId)
  })
}

export const bootstrapGameSocket = () => {
  if(init())
    listen();
}
