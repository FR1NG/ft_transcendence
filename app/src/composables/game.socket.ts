
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app'
import { useSocketStore } from '@/store/socket';
import { useGameStore } from '@/store/game';

const init = (): boolean => {
  const socketStore = useSocketStore();
  const { domain } = storeToRefs(useAppStore());
  return socketStore.initGameSocket(`${domain.value}/game`, {
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
