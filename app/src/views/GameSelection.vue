<script setup lang="ts">
  import { useGameStore } from '@/store/game';
  import { useRouter } from 'vue-router';
  import { computed } from 'vue';
  import { useSocketStore } from '@/store/socket';
  import { storeToRefs } from 'pinia';
  import { bootstrapGameSocket } from '@/composables/game.socket';
  import { ref } from 'vue';

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

// ---------------------------------
const balls = ["/images/ballTheme/classicBall.png", "/images/ballTheme/amongusBall.png", "/images/ballTheme/pacmanBall.png"]
const ball = ref('');
const changeBall = (theme: string) => {
  ball.value = "/images/ballTheme/" + theme + ".png";
}
const resetBall = () => {
  ball.value = "";
}
// ---------------------------------
const ballSpeed = ref("0s");

const changeSpeed = (speed: string) => {
  ballSpeed.value = speed;
}
const resetSpeed = () => {
  ballSpeed.value = "0s";
}
// ---------------------------------
const backToTheme = () => {
  ball.value = '';
  gameStore.themeSelected = false;
  gameStore.modeSelected = false;
}
// ---------------------------------


</script>
  
<template>
    <div class="container">
      <div class="selector" v-if="!themeSelected">
        <div class="title">
          <h2>Select a Theme</h2>
          <img v-if="ball.length" class="ballTheme" :src="ball" alt="">
          </div>
        <div class="buttons">
          <button @click="setTheme('classic')" @mouseover="changeBall('classic')" @mouseleave="resetBall()" class="mode-button">Classic</button>
          <button @click="setTheme('AmongUs')" @mouseover="changeBall('amongUs')" @mouseleave="resetBall()" class="mode-button">AmongUs</button>
          <button @click="setTheme('PacMan')" @mouseover="changeBall('pacMan')" @mouseleave="resetBall()" class="mode-button">PacMan</button>
        </div>
      </div>
      <div class="selector" v-if="themeSelected && !modeSelected">
        <div class="title">
          <h2>Select a mode</h2>
          <!-- <div class="hider"></div> -->
          <img v-if="ball.length" class="ballTheme" :src="ball" alt="">
          </div>
        <div class="buttons">
            <button @click="setMode('EASY')" class="mode-button" @mouseover="changeSpeed('2s')" @mouseleave="resetSpeed()" >Easy</button>
            <button @click="setMode('NORMAL')" class="mode-button" @mouseover="changeSpeed('1s')" @mouseleave="resetSpeed()" >Normal</button>
            <button @click="setMode('HARD')" class="mode-button" @mouseover="changeSpeed('0.6s')" @mouseleave="resetSpeed()" >Hard</button>
          </div>
          <button class="back-to-theme" @click="backToTheme()"> Back </button>
      </div>
    </div>
  </template>


<style lang="scss">

.container {
  background-color: rgb(var(--v-theme-colorOne));
  height: 100%;
  width: 100%;
  padding: 2rem;
  font-size: 3vw;
}
.selector {
  height: 100%;
  width: 100%;
  color: rgb(var(--v-theme-colorTwo));
  .title {
    display: flex;
    align-items: center;
    gap: 3vw;
    h2 {
      margin: 2rem 0;
      letter-spacing: 8px;
    }
    .ballTheme {
    width: 100%;
      width: 5vw;
      height: 5vw;
      opacity: 0;
      transform: scale(0.2);
      animation: appear 0.5s linear forwards,
      moveRight v-bind(ballSpeed) linear infinite;
    }
    @keyframes appear {
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes moveRight {
      0% {
        opacity: 0;
        transform: translateX(-100%);
      }
      40% {
        opacity: 1;
      }
      100% {
        transform: translateX(1100%);
      }
    }
  }
  .buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .mode-button {
      background-color: rgb(var(--v-theme-colorFoure));
      width: 20vw;
      height: 8vw;
      border-radius: 1vw;
      box-shadow: 2px 2px 3px 3px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      transform: scale(1);
      transition: transform 0.5s;
    }
    .mode-button:hover {
      transform: scale(1.2);
    }
  }
}
.back-to-theme {
  position: absolute;
  width: 10vw;
  height: 5vw;
  background-color: black;
  color: white;
  border-radius: 5px;
  bottom: 20px;
  transition: transform 1s, color 1s, background-color 1s;
}
.back-to-theme:hover {
  transform: scale(1.1);
  background-color: white;
  color: black;
  transition: transform 1s, color 1s, background-color 1s;
}
</style>
