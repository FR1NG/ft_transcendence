<script lang="ts" setup>
import SnackBar from '@/components/SnackBar.vue'
</script>

<template>
  <SnackBar />
  <router-view />
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Gugi&display=swap');
body {
  font-family: 'Gugi', cursive;
}
</style>
