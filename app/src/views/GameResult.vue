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
  <div class="gifWrapper">
    <button @click="restartGame" class="restartButton">
      <div v-if="gameResult === 'winner'" class="winner-button">
        <div class="kick">Kick 'Em again</div>
        <div class="mark"> !</div>
      </div>
      <div v-else class="loser-button">
        <div class="take-your"> Take your</div>
        <div class="revenge"> revenge</div>
        <div class="mark">!</div>
      </div>
    </button>
    <v-img class="gif" v-if="gameResult === 'loser'" src="/images/loser.gif"></v-img>
    <v-img class="gif" v-if="gameResult === 'winner'" src="/images/winner.gif"></v-img>
  </div>
</template>


<style lang="scss" scoped>
.gifWrapper {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  background-color: rgb(var(--v-theme-colorOne));
}
.restartButton {
  position: absolute;
  background-color: rgb(var(--v-theme-colorOne));
  color: rgb(var(--v-theme-colorTwo));
  top: 20vw;
  width:22vw;
  height: 5vw;
  font-size: 2vw;
  border-radius: 5px;
  box-shadow: 1px 1px 10px 0.1px black;
  cursor: pointer;
  opacity: 0;
  animation: appear 1s linear forwards 2s;
  z-index: 1;
}
.restartButton:hover {
  opacity: 1 !important;
  
}
@keyframes appear {
  100% {
    opacity: 0.8;
  }
}
.mark {
  animation: tilt 2s linear forwards infinite;
}
@keyframes tilt {
  0%, 50%, 100%{
    transform: rotate(0deg);
  }
  60%,80%  {
    transform: translateX(0.5vw) rotate(20deg);
  }
  70%, 90% {
    transform: translateX(-0.5vw) rotate(-20deg);
  }
}
.restartButton:hover > .loser-button {
  .mark {
    animation: markAnim 1s linear forwards;
  }
  .revenge {
    animation: revengeAnim 0.1s linear forwards 720ms;
  }
}

@keyframes markAnim {
  50% {
    transform: scale(2);
  }
  70% {
    transform: scale(2) rotateZ(-90deg);
  }
  99% {
    transform: translateX() scale(2);
  }
  100% {
    transform: rotateZ(0deg);
  }
}
@keyframes revengeAnim {
  100% {
    transform: translateY(0.7vw) rotateZ(10deg);
  }
}
.loser-button, .winner-button {
  display: flex;
  justify-content: center;
  gap: 0.8vw;
}

.gif {
  height: fit-content;
  width: 100%;
}
</style>
