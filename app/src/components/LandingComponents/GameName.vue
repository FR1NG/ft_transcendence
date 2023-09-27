<script setup lang="ts">
import Ball from './Ball.vue';
</script>

<template>
    <div class="nameWrapper">
      <div class="name">
        <div class="letter p"> p </div>
        <Ball class="letter"/>
        <div class="letter o"> o </div>
        <div class="letter n"> n </div>
        <div class="letter g"> g </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500&display=swap');

.nameWrapper {
  position: relative;
  top: 0;
  height: 50vw;
  width: 100%;
  padding-top: 3vw;
}
.name {
  position: relative;
  height: 100%;
  width: 100%;
  top:0;
  font-family: 'Space Grotesk', sans-serif;
  align-items: center;
  color: rgb(var(--v-theme-colorTwo));
  font-size: 14vw;
}

.letter {
  position: absolute;
}
.p {
  left: 30%;
  animation: group 0.5s linear forwards,
  flyP 1s linear forwards 0.5s,
  reappearP 4s linear forwards 10.5s;
}
.o {
  opacity: 0;
  animation: reappearO 4s linear forwards 10.5s;
}
.n {
  left: 50%;
  animation: group 0.5s linear forwards,
  flyN 1s linear forwards 0.8s,
  reappearN 4s linear forwards 10.5s;
}
.g {
  left: 60%;
  animation: group 0.5s linear forwards,
  flyG 1s linear forwards 0.6s,
  reappearG 4s linear forwards 10.5s;
}


@keyframes group {
  100% {
    left: 50%;
  }
}

@keyframes flyP {
  99% {
    opacity: 1;
    left: -10rem;
    transform: rotate(-360deg);
  }
  100% {
    opacity: 0;
  }
}
@keyframes flyN {
  99% {
    opacity: 1;
    left: 120%;
    transform: rotate(360deg);
  }
  100% {
    opacity: 0;
  }
}
@keyframes flyG {
  99% {
    opacity: 1;
    left: 120%;
    transform: rotate(360deg);
  }
  100% {
    opacity: 0;
  }
}


@keyframes reappearP {
  0% {
    left: 30%;
  }
  50% {
    text-shadow:0 0 10px rgb(233, 209, 209), 0 0 40px rgb(var(--v-theme-colorTwo));
  }
  100% {
  text-shadow: 0 0 3px rgb(233, 209, 209),0 0 20px rgb(var(--v-theme-colorTwo));
    opacity: 1;
    left: 30%;
  }
}
@keyframes reappearO {
  0% {
    left: 40%;
  }
  50% {
    text-shadow:0 0 10px rgb(233, 209, 209), 0 0 40px rgb(var(--v-theme-colorTwo));
  }
  100% {
  text-shadow: 0 0 3px rgb(233, 209, 209),0 0 20px rgb(var(--v-theme-colorTwo));
    opacity: 1;
    left: 40%;
  }
}
@keyframes reappearN {
  0% {
    left: 50%;
  }
  50% {
    text-shadow:0 0 10px rgb(233, 209, 209), 0 0 40px rgb(var(--v-theme-colorTwo));
  }
  100% {
  text-shadow: 0 0 3px rgb(233, 209, 209),0 0 20px rgb(var(--v-theme-colorTwo));
    opacity: 1;
    left: 50%;
  }
}
@keyframes reappearG {
  0% {
    left: 60%;
  }
  50% {
    text-shadow:0 0 10px rgb(233, 209, 209), 0 0 40px rgb(var(--v-theme-colorTwo));
  }
  100% {
  text-shadow: 0 0 3px rgb(233, 209, 209),0 0 20px rgb(var(--v-theme-colorTwo));
    opacity: 1;
    left: 60%;
  }
}
.name::before {
  content: '';
  position: absolute;
  background: rgb(var(--v-theme-colorTwo));
  top: 5%;
  bottom: 0;
  width: 100%;
  height: 100%;
  transform: perspective(500px) rotateX(50deg) scale(0.4, 0.35);
  filter: blur(1.5em);
  opacity: 0;
  animation: reappearLight 3s linear forwards 11s;
}
@keyframes reappearLight {
  100% {
    opacity: 1;
  }
}

</style>