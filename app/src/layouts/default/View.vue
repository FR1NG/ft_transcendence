<template>
  <v-main>
      <SnackBar />
      <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import SnackBar from '@/components/SnackBar.vue'
</script>
