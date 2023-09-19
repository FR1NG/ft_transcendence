<template>
    <div>
    <div class="theme-selector" v-if="!themeSelected.value">
      <h2>Select a Theme:</h2>
      <button @click="setTheme('classic')" class="mode-button">Classic</button>
      <button @click="setTheme('Retro')" class="mode-button">Retro</button>
      <button @click="setTheme('PacMan')" class="mode-button">PacMan</button>
    </div>
    <div class="mode-selector" v-if="themeSelected.value && !modeSelected.value">
      <h2>Select a Mode:</h2>
      <button @click="setMode('EASY')" class="mode-button">Easy</button>
      <button @click="setMode('NORMAL')" class="mode-button">Normal</button>
      <button @click="setMode('HARD')" class="mode-button">Hard</button>
    </div>
      <button v-if="themeSelected.value && modeSelected.value" @click="startGame">
        Start Game
      </button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useGameStore } from '@/store/game';
  
  export default defineComponent({
    name: 'GameSelection',
    setup() {
        type GameMode = 'EASY' | 'NORMAL' | 'HARD';
        const gameStore = useGameStore();
        const themes = gameStore.themes;
        const themeSelected = gameStore.themeSelected.value;
        const modeSelected = gameStore.modeSelected.value;
        const currentTheme = gameStore.currentTheme.value;

        const setTheme = (theme: keyof typeof themes) => {
        gameStore.setTheme(theme);
        };

        const setMode = (mode: GameMode) => {
        gameStore.setMode(mode);
        };
    
        const themeNames = Object.keys(themes) as Array<keyof typeof themes>;
        const gameModes: GameMode[] = ['EASY', 'NORMAL', 'HARD'];

    const startGame = () => {
        console.log("Game started with theme:", gameStore.selectedTheme.value, "and mode:", gameStore.selectedMode.value);
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
        startGame
    };
    }
});
</script>

<style lang="scss">

@import url('https://fonts.cdnfonts.com/css/public-pixel');

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
    0 0 5px rgb(var(--v-theme-colorTwo)),
    0 0 10px rgb(var(--v-theme-colorTwo)),
    0 0 15px rgb(var(--v-theme-colorThree)),
    0 0 20px rgb(var(--v-theme-colorThree)),
    0 0 25px rgb(var(--v-theme-colorThree)),
    0 0 30px rgb(var(--v-theme-colorThree));
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