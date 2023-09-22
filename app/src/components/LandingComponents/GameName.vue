
import { getCurrentInstance } from 'vue';

import { relative } from 'path';
<script setup>
</script>

<template>
    <div class="nameWrapper">
        <h1 class="gameName">pong</h1>
    </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500&display=swap');

.nameWrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.gameName {
  position: relative;
  font-family: 'Space Grotesk', sans-serif;
  color: rgb(var(--v-theme-colorTwo));
  text-shadow: 0 0 0.055em rgb(233, 209, 209), 0 0 0.125em rgb(var(--v-theme-colorTwo));
  opacity: 0;
  font-size: 14vw;
  animation: textAppear 3s forwards 8.5s;
}

.gameName::before {
  content: '';
  position: absolute;
  background: rgb(var(--v-theme-colorTwo));
  top: 80%;
  bottom: 0;
  width: 100%;
  height: 100%;
  transform: perspective(1em) rotateX(40deg) scale(1, 0.35);
  filter: blur(0.6em)
}

@keyframes textAppear {
  15% {
    text-shadow: 0 0 0.6em rgb(var(--v-theme-colorTwo)), 0 0 0.6em  rgb(var(--v-theme-colorTwo));
    opacity: 0.1;
  }
  30% {
    text-shadow: 0 0 0.4em rgb(var(--v-theme-colorTwo)), 0 0 0.4em rgb(var(--v-theme-colorTwo));
    opacity: 0.2;
  }
  45% {
    text-shadow: 0 0 0.3em rgb(var(--v-theme-colorTwo)), 0 0 0.3em rgb(var(--v-theme-colorTwo));
    opacity: 0.3;
  }
  60% {
    text-shadow: 0 0 0.2em rgb(var(--v-theme-colorTwo)), 0 0 0.2em rgb(var(--v-theme-colorTwo));
    opacity: 0.4;
  }
  70% {
    text-shadow: 0 0 0.1em rgb(var(--v-theme-colorTwo)), 0 0 0.175em rgb(var(--v-theme-colorTwo));
    opacity: 0.5;
  }
  80% {
    text-shadow: 0 0 0.07em rgb(var(--v-theme-colorTwo)), 0 0 0.150em rgb(var(--v-theme-colorTwo));
    opacity: 0.65;
  }
  90% {
    text-shadow: 0 0 0.06em rgb(var(--v-theme-colorTwo)), 0 0 0.140em rgb(var(--v-theme-colorTwo));
    opacity: 0.8;
  }
  100% {
    text-shadow: 0 0 0.055em rgb(var(--v-theme-colorTwo)), 0 0 0.125em rgb(var(--v-theme-colorTwo));
    opacity: 1;
  }
}

</style>