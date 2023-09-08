<script setup lang="ts">
import CustomCard from '@/components/CustomCard.vue';
import Play from '@/components/HomeComponents/Play.vue'


</script>

<template>
  <v-card elevation="4" class="homeContainer">
    <Play/>
  </v-card>

</template>


<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Gugi&display=swap');

::-webkit-scrollbar {
  display: none;
}
.homeContainer {
  background-color: rgb(var(--v-theme-primary));
  font-family: 'Gugi', cursive;
  height: 93vh;
  overflow:scroll;
}

</style>
