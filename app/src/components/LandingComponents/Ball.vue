<script setup lang="ts">
import Paddles from './Paddles.vue'
</script>

<template>
    <div class="ballWrapper">
      <div class="conta">
        <div class="ball"></div>
        <Paddles/>
      </div>
    </div>
</template>

<style lang="scss" scoped>


.ballWrapper {
  position: absolute;
  width: 100%;
  height: 100%;
}
.conta {
  position: relative;
  width: 100%;
  height: 100%;
}

.ball {
  position: absolute;
  top: -10rem;
  left: -10vw;
  width: 5vw;
  height: 5vw;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-colorTwo));
  animation:
            bouncing 4s linear forwards 0.5s,
            squashing 4s linear forwards 0.5s,
            bend1 1s linear 4.5s,
            strike1 1s linear forwards 4.5s,
            bend2 1s linear 5.5s,
            strike2 1s linear forwards 5.5s,
            bend3 1s linear 6.5s,
            strike3 1s linear forwards 6.5s,
            bend4 1s linear 7.5s,
            strike4 1s linear forwards 7.5s,
            strike5 0.5s linear forwards 8.5s,
            speeding1 2s linear forwards 9s, 
            speeding2 0.1s forwards 11s 30,
            fadeOut 3s forwards 10s;
}

@keyframes group {
  100% {
    box-shadow: 0 0 15px 5px rgb(var(--v-theme-colorTwo));
    left: 51vw;
  }
}
@keyframes flyLeft {
  98% {
    width: 5vw;
    height: 5vw;
    left: 0;
    top: -2vw;
    border-radius: 50%;
  }
  100%{
    left: 0;
    top: -2vw;
    width: 3vw;
    border-radius: 25px 50px 50px 25px;

  }
}
@keyframes bouncing {
  16%, 48%, 78% {
    top: 30vw;
    animation-timing-function: ease-out;   
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
  2%, 15%, 20%, 47%, 52%, 77%, 82%, 98%{
    transform: rotate(0);
    width: 5vw;
    height: 5vw;
    border-radius: 50%;
  }
  16%, 48%, 78%, 100% {
    height: 3vw;
    border-radius: 50px 50px 25px 25px;
  }
  100% {
    transform: rotate(-50deg);
    height: 3vw;
    width: 5vw;
  }
}

@keyframes bend1 {
  100% {
    top: -20vw;
  }
}
@keyframes strike1 {
  5%, 98% {
    height: 5vw;
    width: 5vw;
    border-radius: 50%;
  }
  100% {
    top: 15vw;
    left: 10vw;
    transform: rotate(50deg);
    height: 3vw;
  }
}
@keyframes bend2 {
  100% {
    top: -20vw;
  }
}
@keyframes strike2 {
  5%, 98% {
    height: 5vw;
    border-radius: 50%;
  }
  100% {
    transform: rotate(-130deg);
    top: 0vw;
    left: 85vw;
    height: 3vw;
  }
}
@keyframes bend3 {
  100% {
    top: -20vw;
  }
}
@keyframes strike3 {
  5%, 98% {
    width: 5vw; height: 5vw;
    border-radius: 50%;
  }
  100% {
    top: 30vw;
    left: 20vw;
    transform: rotate(50deg);
    height: 3vw;
  }
}
@keyframes bend4 {
  100% {
    top: -20vw;
  }
}
@keyframes strike4 {
  5%, 98% {
    width: 5vw; height: 5vw;
    border-radius: 50%;
  }
  100% {
    transform: rotate(0deg);
    top: 11vw;
    left: 63vw;
    width: 3vw; height: 5vw;
    border-radius: 50px 25px 25px 50px;
  }
}
@keyframes strike5 {
  5%, 98% {
    width: 5vw; height: 5vw;
    border-radius: 50%;
  }
  100% {
    height: 5vw; width: 3vw;
    left: 33vw;
    border-radius: 25px 50px 50px 25px;
  }
}
@keyframes speeding1 {
  0%, 100% {
    border-radius: 50%;
    width: 5vw; height: 5vw;
  }
  10%, 30%, 50%, 64%, 78%, 86%, 92%, 96%, 98%, 99% 
  {
    left: 61vw;  
    animation-timing-function: ease-in;
  }
  20%, 40%, 57%, 71%, 82%, 90%, 94%, 97%, 98.5% 
  {
    left: 33vw;   
    animation-timing-function: ease-in;
  }
  100% 
  {
    left: 33vw;   
    animation-timing-function: ease-in;
    transform: rotate(360deg);
  }
}
@keyframes speeding2 {
  10%, 30%, 50%, 70%, 90% 
  {
    left: 61vw;  
    animation-timing-function: ease-out;
  }
  20%, 40%, 60%, 80%, 100% 
  {
    box-shadow: 0 0 0.3em 0.3em rgb(var(--v-theme-colorTwo));
    left: 33vw;   
    animation-timing-function: ease-out;
    transform: rotate(360deg);
  }
}
@keyframes fadeOut {
  15% {
    opacity: 0.8;
    box-shadow: 0 0 2px 2px rgb(var(--v-theme-colorTwo));
  }
  30% {
    opacity: 0.7;
    box-shadow: 0 0 5px 5px rgb(var(--v-theme-colorTwo));
  }
  45% {
    opacity: 0.5;
    box-shadow: 0 0 10px 10px rgb(var(--v-theme-colorTwo));
  }
  60% {
    opacity: 0.4;
    box-shadow: 0 0 15px 15px rgb(var(--v-theme-colorTwo));
  }
  75% {
    opacity: 0.2;
    box-shadow: 0 0 20px 20px rgb(var(--v-theme-colorTwo));
  }
  90% {
    opacity: 0.1;
    box-shadow: 0 0 25px 25px rgb(var(--v-theme-colorTwo));
  }
  100% {
    opacity: 0;
  }
}

</style>