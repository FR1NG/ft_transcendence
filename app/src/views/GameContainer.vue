<script setup lang="ts">
  import { storeToRefs } from 'pinia';
import Game from './Game.vue'
  import GameResult from './GameResult.vue'
  import { useGameStore } from "@/store/game";

  const gameStore = useGameStore();
  const { gameResult } = storeToRefs(gameStore);

</script>

<template>
  <div>
    <GameResult v-if="gameResult.length !== 0"/>
    <Game v-else/>
  </div>
</template>
