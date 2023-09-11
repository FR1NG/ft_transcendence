<script setup lang="ts">
import CustomCard from '@/components/CustomCard.vue';
import Play from '@/components/HomeComponents/Play.vue'

</script>

<template>
    <Play/>
</template>


<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Gugi&display=swap');

::-webkit-scrollbar {
  display: none;
}
.homeContainer {
  background-color: rgb(var(--v-theme-colorOne));
  font-family: 'Gugi', cursive;
  height: 93vh;
  overflow:scroll;
}

</style>
