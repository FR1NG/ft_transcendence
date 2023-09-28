<template>
    <div class="container">
    <div class="theme-selector" v-if="!themeSelected">
      <h2>Select a Theme:</h2>
      <button @click="setTheme('classic')" class="mode-button">Classic</button>
      <button @click="setTheme('AmongUs')" class="mode-button">AmongUs</button>
      <button @click="setTheme('PacMan')" class="mode-button">PacMan</button>
    </div>
    <div class="mode-selector" v-if="themeSelected && !modeSelected">
      <h2>Select a Mode:</h2>
      <button @click="setMode('EASY')" class="mode-button">Easy</button>
      <button @click="setMode('NORMAL')" class="mode-button">Normal</button>
      <button @click="setMode('HARD')" class="mode-button">Hard</button>
    </div>
    </div>
  </template>

  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useGameStore } from '@/store/game';
  import { useRouter } from 'vue-router';
  import { computed } from 'vue';
  import { useSocketStore } from '@/store/socket';
import { storeToRefs } from 'pinia';
import { bootstrapGameSocket } from '@/composables/game.socket';

  export default defineComponent({
    name: 'GameSelection',
    setup() {
      type GameMode = 'EASY' | 'NORMAL' | 'HARD';
      const gameStore = useGameStore();
      const themes = gameStore.themes;
      const themeSelected = computed(() => gameStore.themeSelected);
      const modeSelected = computed(() => gameStore.modeSelected);
      const currentTheme = computed(() => gameStore.currentTheme);
      const themeNames = Object.keys(themes) as Array<keyof typeof themes>;
      const gameModes: GameMode[] = ['EASY', 'NORMAL', 'HARD'];
      const router = useRouter();
      const socketStore = useSocketStore();
      const { gameSocket } = storeToRefs(socketStore);

      bootstrapGameSocket();
      const setTheme = (theme: keyof typeof themes) => {
        gameStore.setTheme(theme);
      };
      const setMode = (mode: GameMode) => {
        gameStore.setMode(mode);
        try {
          gameSocket.value?.emit('joinQueue', mode)
          router.push({ name: 'Game' });
        } catch (error) {
        }
      };

    return {
      themeSelected,
      themes,
      currentTheme,
      modeSelected,
      themeNames,
      gameModes,
      setTheme,
      setMode,
    };
  }
});
</script>

<style lang="scss">

@import url('https://fonts.cdnfonts.com/css/public-pixel');

body, html {
  overflow: hidden !important;
  color: rgb(var(--v-theme-colorOne));
}
.container {
  background-color: rgb(var(--v-theme-colorOne));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden !important;
}
.theme-selector, .mode-selector {
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family: 'Public Pixel';
  font-size: 20px;
  color: rgb(var(--v-theme-colorFoure));
}
.mode-button {
  margin-top: 20px;
  font-size: 24px;
  font-family: 'Public Pixel', sans-serif;
  padding: 16px 32px;
  margin: 12px;
  border: none;
  background-color: transparent;
  color: rgb(var(--v-theme-colorTwo));
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.3s ease;

  /* Neon effect */
  box-shadow:
    0 0 1px rgb(var(--v-theme-colorTwo)),
    0 0 1px rgb(var(--v-theme-colorTwo)),
    0 0 2px rgb(var(--v-theme-colorThree)),
    0 0 2px rgb(var(--v-theme-colorThree)),
    0 0 2px rgb(var(--v-theme-colorThree)),
    0 0 2px rgb(var(--v-theme-colorThree));
}

.mode-button:active, #startButton:active {
  transform: scale(0.9);
  box-shadow: 0 2px 5px rgb(var(--v-theme-colorThree));
}

/* Animation on modes buttons */
.mode-button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
      transform: scale(1);
  }
  50% {
      transform: scale(1.1);
  }
  100% {
      transform: scale(1);
  }
}
</style>
