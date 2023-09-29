import { defineStore } from 'pinia';
import { useTheme } from 'vuetify/lib/framework.mjs';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'light',
  }),
  actions: {
    initTheme() {
      const theme = localStorage.getItem('theme');
      if(theme)
        this.theme = theme;
      this.setTheme(this.theme)
    },
    setTheme(theme: string) {
      const vTheme = useTheme();
      vTheme.global.name.value = theme;
    }
  }
})
