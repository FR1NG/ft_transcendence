<script setup lang="ts">
  import { useGameStore } from '@/store/game';
  import { storeToRefs } from 'pinia';

  const gameStore = useGameStore();
  const { gameResult } = storeToRefs(gameStore);

  const restartGame = () => {
    gameStore.restartGame();
  }
</script>

<template>
  <v-card v-if="gameResult.length > 0" cover max-height="400">
    <button @click="restartGame" id="restartButton">{{ gameResult === 'winner' ? 'Kick his ass again' : 'Take your revenge'}}</button>
      <v-img v-if="gameResult === 'loser'" src="https://reactiongifs.me/cdn-cgi/imagedelivery/S36QsAbHn6yI9seDZ7V8aA/834cf73d-3eee-46c2-45af-4e1c12681900/w=480"></v-img>
      <v-img  v-if="gameResult === 'winner'" src="https://media.tenor.com/bhdatE0lYLoAAAAd/celebration-celebrating.gif"></v-img>
    </v-card>
</template>


<style lang="scss">
@import url('https://fonts.cdnfonts.com/css/public-pixel');
#restartButton {
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  background-color: rgb(var(--v-theme-colorThree));
  opacity: .5;

&:hover {
  opacity: 1;
}
  box-shadow:
    0 0 5px rgb(var(--v-theme-colorTwo)),
    0 0 10px rgb(var(--v-theme-colorTwo)),
    0 0 15px rgb(var(--v-theme-colorThree)),
    0 0 20px rgb(var(--v-theme-colorThree)),
    0 0 25px rgb(var(--v-theme-colorThree)),
    0 0 30px rgb(var(--v-theme-colorThree));
}
</style>
