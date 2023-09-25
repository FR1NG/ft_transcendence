<script setup lang="ts">
</script>

<template>
    <div class="bounceWrapper">
      <div class="ball"></div>
      <div class="leftSide"></div>
      <div class="rightSide"></div>
    </div>
</template>

<style lang="scss" scoped>


.bounceWrapper {
position: relative;
  width: 100%;
  height: 40vw;
  display: flex;
//   background-color: grey;
}

.ball {
  width: 5vw;
  height: 5vw;
  position: absolute;
  border-radius: 50%;
  background: rgb(var(--v-theme-colorTwo));
  left: 0;
  top: 0;
  box-shadow: 0 0 1em 0 rgb(var(--v-theme-colorTwo));
  animation: bouncing 5s linear forwards 0.5s,
             squashing 5s linear forwards 0.5s;
}

@keyframes bouncing {
  16%, 48%, 78% {
    top: 30vw;
    animation-timing-function: ease-out;   do the animation that you decided when the user clicks on login the O in pong falls and splashes it's color all over the screen
  }
  32% {
    top: 8vw;
    animation-timing-function: ease-in;
  }
  62% {
    top: 12vw;
    animation-timing-function: ease-in;
  }
  90% {
    top: 20vw;
    animation-timing-function: ease-in;
  }
  100% {
    top: 25vw;
    left: 80%;
    // transform: rotate(360deg);
  }
}

@keyframes squashing {
    16%, 48%, 78% {
        height: 3vw;
        border-radius: 50px 50px 25px 25px;
    }
    15%, 20%, 47%, 52%, 77%, 82%, 100% {
        height: 5vw;
        border-radius: 50%;
    }
    
}

</style>