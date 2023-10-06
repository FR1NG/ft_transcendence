<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  points: number
}>();

const level = ref(0);
const nextGoal = ref(0);
const leagues = [
  10,
  50,
  100,
  500,
  1800,
  5000,
  10000,
];

const calculate = () => {
  nextGoal.value = leagues.find((el: number) => el > props.points) || 0;
  level.value = props.points * 100 / nextGoal.value;
}

calculate();
</script>

<template>
  <v-progress-linear
      class="level-bar"
      v-model="level"
      color="colorThree"
      height="25"
    >
    {{ `${points} / ${nextGoal}` }}
  </v-progress-linear>
</template>

<style lang="scss">

  .level-bar {
    width: 95%;
    border-radius: 20px;
  }
</style>
