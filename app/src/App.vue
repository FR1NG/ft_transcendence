<template>
  <SnackBar />
  <router-view />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'
import SnackBar from '@/components/SnackBar.vue'

const appStore = useAppStore();
appStore.getInitialData();
</script>
