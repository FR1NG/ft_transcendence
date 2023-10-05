
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app'
import { useSocketStore } from '@/store/socket';
import { useGameStore } from '@/store/game';
import { useAuthStore } from '@/store/auth';
import { pushNotify } from './simpleNotify';

const init = (): boolean => {
  const socketStore = useSocketStore();
  const { domain } = storeToRefs(useAppStore());
  return socketStore.initGameSocket(`${domain.value}/game`, {
    auth: {
      token: useAuthStore().getToken(),
    }
  });
}

const listen = () => {
  const socketStore =  useSocketStore()
  const { gameSocket } = storeToRefs(socketStore);
  const gameStore = useGameStore();
  const { rematch } = storeToRefs(gameStore);

  gameSocket.value?.on('game-result' , (data) => {
    gameStore.setResult(data.result);
    gameStore.setRestartId(data.restartId)
  });

    // on opponent leave event
    gameSocket.value?.on('no-rematch', () => {
      console.log('other user leaved')
      rematch.value = false
    })

  gameSocket.value?.on('error', (error: any) => {
      pushNotify({status:'error', title:'error', text:error.toString()})
  })
}

export const bootstrapGameSocket = () => {
  if(init())
    listen();
}
