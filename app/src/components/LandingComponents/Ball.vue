<script setup>
</script>

<template>
    <div class="bounceWrapper">
      <div class="ball"></div>
      <div class="trail trail-1"></div>
      <div class="trail trail-2"></div>
      <div class="trail trail-3"></div>
      <div class="trail trail-4"></div>
      <div class="trail trail-5"></div>
      <div class="trail trail-6"></div>
      <div class="trail trail-7"></div>
      <div class="trail trail-8"></div>
      <div class="trail trail-9"></div>
      <div class="leftSide"></div>
      <div class="ltrail ltrail-1"></div>
      <div class="ltrail ltrail-2"></div>
      <div class="ltrail ltrail-3"></div>
      <div class="ltrail ltrail-4"></div>
      <div class="ltrail ltrail-5"></div>
      <div class="ltrail ltrail-6"></div>
      <div class="rightSide"></div>
      <div class="rtrail rtrail-1"></div>
      <div class="rtrail rtrail-2"></div>
      <div class="rtrail rtrail-3"></div>
      <div class="rtrail rtrail-4"></div>
      <div class="rtrail rtrail-5"></div>
      <div class="rtrail rtrail-6"></div>
    </div>
</template>

<style lang="scss">


.bounceWrapper {
  position: absolute;
  top: 1.2vw;
  left: -0.3vw;
  width: 100%;
  height: 25vw;
  display: flex;
}

.ball {
  width: 5vw;
  height: 5vw;
  position: absolute;
  border-radius: 50%;
  background: rgb(var(--v-theme-colorTwo));
  left: 0px;
  top: 0;
  box-shadow: 0 0 1em 0 rgb(var(--v-theme-colorTwo));
  animation: bouncing 3s linear forwards 500ms, ballStrike1 800ms linear forwards 3500ms,
  ballStrike2 800ms linear forwards 4300ms, ballStrike3 800ms linear forwards 5100ms,
  ballStrike4 800ms linear forwards 5900ms, ballStrike5 800ms linear forwards 6700ms,
  speeding1 2s linear forwards 7500ms, speeding2 0.1s forwards 9500ms 30,
  fadeOut 4s forwards 8500ms;
}

.trail {
  width: 5vw;
  height: 5vw;
  position: absolute;
  border-radius: 50%;
  background: rgb(var(--v-theme-colorTwo));
  box-shadow: 0 0 1em 0 rgb(var(--v-theme-colorTwo));
  left: 0px;
  top: 0;
}

@for $i from 1 through 9 {
  .trail-#{$i} {
    opacity: 1 - calc($i / 10);
    animation : bouncing 3s linear forwards calc($i * 20) + 500ms, ballStrike1 800ms linear forwards calc($i * 20) + 3500ms,
    ballStrike2 800ms linear forwards calc($i * 20) + 4300ms, ballStrike3 800ms linear forwards calc($i * 20) + 5100ms,
    ballStrike4 800ms linear forwards calc($i * 20) + 5900ms, ballStrike5 800ms linear forwards calc($i * 20) + 6700ms,
    speeding1 2s linear forwards calc($i * 20) + 7500ms, speeding2 0.4s forwards calc($i * 40) + 9500ms 30,
    fadeOut 4s forwards calc($i * 20) + 8500ms;
  }
}

.ltrail {
  width: 1.8vw;
  height: 10.12vw;
  position: absolute;
  background-color: rgb(var(--v-theme-colorTwo));
  box-shadow: 0 0 1em 0 rgb(var(--v-theme-colorTwo));
  left: -5%;
  top: 10vw;
}
@for $i from 1 through 9 {
  .ltrail-#{$i} {
    opacity: 1 - calc($i / 6);
  animation: leftAppear 200ms linear forwards calc($i * 20) +  4100ms, leftMove1 200ms linear forwards calc($i * 20) +  5700ms,
  leftMove2 200ms linear forwards calc($i * 20) +  7300ms, fadeOut 1s forwards calc($i * 20) +  8000ms;
  }
}

.rtrail {
  width: 1.8vw;
  height: 10.12vw;
  position: absolute;
  background-color: rgb(var(--v-theme-colorTwo));
  box-shadow: 0 0 1em 0 rgb(var(--b-theme-colorTwo));
  top:30vw;
  left: 105%;
}
@for $i from 1 through 9 {
  .rtrail-#{$i} {
    opacity: 1 - calc($i / 6);
  animation: rightAppear 200ms linear forwards calc($i * 20) + 3300ms, rightMove1 200ms linear forwards calc($i * 20) + 4900ms,
  rightMove2 200ms linear forwards calc($i * 20) + 6500ms, fadeOut 1s forwards calc($i * 20) + 8000ms;
  }
}



.leftSide {
  width: 1.8vw;
  height: 10.12vw;
  position: absolute;
  background-color: rgb(var(--v-theme-colorTwo));
  box-shadow: 0 0 1em 0 rgb(var(--v-theme-colorTwo));
  left: -5%;
  top: 10vw;
  animation: leftAppear 200ms linear forwards 4100ms, leftMove1 200ms linear forwards 5700ms,
  leftMove2 200ms linear forwards 7300ms, fadeOut 2s forwards 8000ms;
}

.rightSide {
  width: 1.8vw;
  height: 10.12vw;
  position: absolute;
  background-color: rgb(var(--v-theme-colorTwo));
  box-shadow: 0 0 1em 0 rgb(var(--v-theme-colorTwo));
  top:30vw;
  left: 105%;
  animation: rightAppear 200ms linear forwards 3300ms, rightMove1 200ms linear forwards 4900ms,
  rightMove2 200ms linear forwards 6500ms, fadeOut 2s forwards 8000ms;
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
    transform: rotate(360deg);
  }
  
}

@keyframes ballStrike1 {
  100% {
    top: 12.5vw;
    left: 21%; 
    animation-timing-function: ease-out;   
  }
}
@keyframes ballStrike2 {
  100% {
    top: 15;
    left: 70%;   
    animation-timing-function: ease-out;
    transform: rotate(360deg);
  }
}
@keyframes ballStrike3 {
  100% {
    top: 19.5vw;
    left: 30%;   
    animation-timing-function: ease-in;
    transform: rotate(360deg);
  }
}
@keyframes ballStrike4 {
  100% {
    top: 9.5vw;
    left: 61.5%;   
    animation-timing-function: ease-in;
    transform: rotate(360deg);
  }
}
@keyframes ballStrike5 {
  100% {
    top: 9.5vw;
    left: 35.5%; 
    animation-timing-function: ease-in;
    transform: rotate(360deg);
  }
}
@keyframes speeding1 {
  10%, 30%, 50%, 64%, 78%, 86%, 92%, 96%, 98%, 99% 
  {
    top: 9.5vw;
    left: 61%;  
    animation-timing-function: ease-in;
  }
  20%, 40%, 57%, 71%, 82%, 90%, 94%, 97%, 98.5% 
  {
    top: 9.5vw;
    left: 35.5%;   
    animation-timing-function: ease-in;
  }
  100% 
  {
    top: 9.5vw;
    left: 35.5%;   
    animation-timing-function: ease-in;
    transform: rotate(360deg);
  }
}
@keyframes speeding2 {
  10%, 30%, 50%, 70%, 90% 
  {
    top: 9vw;
    left: 61%;  
    animation-timing-function: ease-out;
  }
  20%, 40%, 60%, 80%, 100% 
  {
    box-shadow: 0 0 1em 1em rgb(var(--v-theme-colorTwo));
    top: 9vw;
    left: 35.5%;   
    animation-timing-function: ease-out;
    transform: rotate(360deg);
  }
}
@keyframes fadeOut {
  15% {
    opacity: 0.8;
  }
  30% {
    opacity: 0.7;
  }
  45% {
    opacity: 0.5;
  }
  60% {
    opacity: 0.4;
  }
  75% {
    opacity: 0.2;
  }
  90% {
    opacity: 0.1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes rightAppear {
  100% {
    left: 84%;
    top: 22vw;
    animation-timing-function: ease-in;
  }
}
@keyframes leftAppear {
  100% {
    left: 19.5%;
    top: 10vw;
    animation-timing-function: ease-in;
  }
}
@keyframes rightMove1 {
  100% {
    left: 74.7%;
    top: 13vw;
    animation-timing-function: ease-in;
  }
}
@keyframes leftMove1 {
  100% {
    left: 29%;
    top: 16.5vw;
    animation-timing-function: ease-in;
  }
}
@keyframes rightMove2 {
  100% {
    left: 65.5%;
    top: 6.66vw;
    animation-timing-function: ease-in;
  }
}
@keyframes leftMove2 {
  100% {
    left: 33.85%;
    top: 6.66vw;
    animation-timing-function: ease-in;
  }
}

</style>