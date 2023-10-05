<script setup>
</script>

<template>
    <div class="paddlesWrapper">
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

<style lang="scss" scoped>


.paddlesWrapper {
  position: absolute;
  top: 1.2vw;
  left: -0.3vw;
  width: 100%;
  height: 25vw;
  display: flex;
}

.ltrail {
  width: 1.4vw;
  height: 9.7vw;
  position: absolute;
  background-color: rgb(var(--v-theme-colorTwo));
  left: -5%;
  top: 10vw;
}
@for $i from 1 through 9 {
  .ltrail-#{$i} {
    opacity: 1 - calc($i / 6);
  animation:  leftAppear 0.5s linear forwards calc($i * 20) + 5000ms,
              revert_1 0.5s linear forwards calc($i * 20) + 5500ms,
              leftMove1 0.5s linear forwards calc($i * 20) + 7000ms,
              revert0 0.5s linear forwards calc($i * 20) + 7500ms,
              leftMove2 0.5s linear forwards calc($i * 20) + 8500ms,
              fadeOut 4s forwards calc($i * 20) + 8000ms;
  }
}

.rtrail {
  width: 1.4vw;
  height: 9.7vw;
  position: absolute;
  background-color: rgb(var(--v-theme-colorTwo));
  top:30vw;
  left: 105%;
}
@for $i from 1 through 9 {
  .rtrail-#{$i} {
    opacity: 1 - calc($i / 6);
    animation: 
              rightAppear 0.5s linear forwards calc($i * 20) + 4000ms,
              revert1 0.5s linear forwards calc($i * 20) + 4500ms,
              rightMove1 0.8s linear forwards calc($i * 20) + 5700ms,
              revert_1 0.5s linear forwards calc($i * 20) + 6500ms,
              rightMove2 0.8s linear forwards calc($i * 20) + 7700ms,
              g-shape 3s linear forwards calc($i * 20) + 8700ms,
              fadeOut 4s forwards calc($i * 20) + 8000ms;
  }
}



.leftSide {
  width: 1.4vw;
  height: 9.7vw;
  position: absolute;
  background-color: rgb(var(--v-theme-colorTwo));
  box-shadow: 0 0 3px 0.1px rgba(var(--v-theme-colorTwo), 0.5);
  left: -5%;
  top: 10vw;
  animation:  leftAppear 0.5s linear forwards 5s,
              revert_1 0.5s linear forwards 5.5s,
              leftMove1 0.5s linear forwards 7s,
              revert0 0.5s linear forwards 7.5s,
              leftMove2 0.5s linear forwards 8.5s,
              fadeOut 4s forwards 8s;
}

.rightSide {
  width: 1.4vw;
  height: 9.7vw;
  position: absolute;
  background-color: rgb(var(--v-theme-colorTwo));
  box-shadow: 0 0 3px 0.1px rgba(var(--v-theme-colorTwo), 0.5);
  top:30vw;
  left: 105%;
  animation: 
            rightAppear 0.5s linear forwards 4s,
            revert1 0.5s linear forwards 4.5s,
            rightMove1 0.8s linear forwards 5.7s,
            revert_1 0.5s linear forwards 6.5s,
            rightMove2 0.8s linear forwards 7.7s,
            g-shape 3s linear forwards 8.7s,
            fadeOut 4s forwards 8s;
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

@keyframes revert1 {
  100% {  
    transform: rotate(1turn);
  }
}
@keyframes revert_1 {
  100% {  
    transform: rotate(-1turn);
  }
}
@keyframes revert0 {
  100% {  
    transform: rotate(-2turn);
  }
}

@keyframes rightAppear {
  100% {
    transform: rotate(400deg);
    left: 84vw;
    top: 21vw;
    animation-timing-function: ease-in;
  }
}
@keyframes leftAppear {
  100% {
    transform: rotate(-400deg);
    left: 9vw;
    top: 10vw;
    animation-timing-function: ease-in;
  }
}
@keyframes rightMove1 {
  100% {
    transform: rotate(-400deg);
    left: 89vw;
    top: -5vw;
    animation-timing-function: ease-in;
  }
}
@keyframes leftMove1 {
  100% {
    transform: rotate(-760deg);
    left: 19vw;
    top: 25vw;
    animation-timing-function: ease-in;
  }
}
@keyframes rightMove2 {
  100% {
    transform: rotate(360deg);
    left: 66.4vw;
    top: 7.2vw;
    animation-timing-function: ease-in;
  }
}
@keyframes leftMove2 {
  100% {
    transform: rotate(-1turn);
    left: 31.8vw;
    top: 7.2vw;
    animation-timing-function: ease-in;
  }
}
@keyframes g-shape {
  100% {
    border-radius: 0 0 25px 0;
  }
}

</style>