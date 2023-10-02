<script lang="ts" setup>
import { bootstrap } from './composables/socket';
import { onMounted } from 'vue';
import { useThemeStore } from '@/store/theme';

const themeStore = useThemeStore();
themeStore.initTheme();
</script>

<template>
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

.v-overlay--active.ovelay {
    backdrop-filter: blur(2px);
    background: rgba(var(--v-theme-colorTwo),0.3);
}
</style>
