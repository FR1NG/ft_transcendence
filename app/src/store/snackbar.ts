import { defineStore } from "pinia";
import { timeout } from '@/composables/helpers'

export const useSnackBarStore = defineStore('snack-bar', {
  state: () => ({
    message: '',
    title: '',
    open: false,
  }),
  getters:  {

  },
  actions: {
    async notify(message: string, title: string = "", time: number = 3): Promise<any> {
      this.message = message;
      this.title = title;
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
