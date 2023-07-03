import { defineStore } from "pinia";
import { timeout } from '@/composables/helpers'

export const useSnackBarStore = defineStore('snack-bar', {
  state: () => ({
    message: 'hello marhaban',
    open: true,
  }),
  getters:  {

  },
  actions: {
    async notify(message: string, time: number = 3): Promise<any> {
      this.message = message;
      this.open = true;
      await timeout(time * 1000);
      this.close();
    },
    close() {
      this.open = false;
      this.message = '';
    }
  }
})
