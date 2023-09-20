<script lang="ts" setup>
import SnackBar from '@/components/SnackBar.vue'
import { bootstrap } from './composables/socket';
import { onMounted } from 'vue';

onMounted(() => {
  bootstrap();
})
</script>

<template>
  <SnackBar />
  <router-view />
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Gugi&display=swap');

::-webkit-scrollbar {
  display: none;
}
body {
  font-family: 'Gugi', cursive;
}
</style>
