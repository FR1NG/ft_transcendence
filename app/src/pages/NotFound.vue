<script setup>

</script>

<template>
  <h1 class="header">ft_transcendence</h1>
  <div class="pageContainer">
      <div class="right"> 4 </div>
      <div class="middle"> 0 </div>
      <div class="ball"></div>
      <div class="left"> 4 </div>
  </div>
</template>


<style>
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz@6..96&display=swap');

  .header {
    color: white;
    background-color: rgb(var(--v-theme-colorOne));
  }
  .pageContainer {
    position: relative;
    width: 100vw;
    height: 95vh;
    background-color: rgb(var(--v-theme-colorOne));
    font-family: 'Bodoni Moda', serif;
    color: white;
    display: flex;
    overflow: hidden;
    justify-content: center;
    padding: 5rem;
    font-size: 20vw;
    text-shadow: 0 0 3px white;

    .right {
      position: absolute;
      right: 25%;
      top: -5vw;
    }

    .middle {
      position: absolute;
      left: 45%;
      top: -5vw;
      animation: fadeOut 0.5s linear forwards 1s;
    }

      .ball {
        position: absolute;
        left: 45.5%;
        top: 1.9vw;
        width: 11.5vw;
        height: 15.6vw;
        background-color: white;
        border-radius: 50%;
        opacity: 0;
        animation: reshape 0.5s linear forwards 1s,
        bounce 3s linear infinite 1.5s;
      }

    .left {
      position:absolute;
      left: 25%;
      top: -5vw;
    }
  }
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes reshape {
    100% {
      opacity: 1;
        left: 48.2%;
        top: 7vw;
        width: 6vw;
        height: 6vw;
    }
  }

  @keyframes bounce {
    14% {
      left: 34%;
      top: 7vw;
    }
    28% {
      left: 65%;
      top: 10vw;
    }
    42% {
      left: 34%;
      top: 3vw;
    }
    56% {
      left: 65%;
      top: 3vw;
    }
    70% {
      left: 34%;
      top: 10vw;
    }
    84% {
      left: 65%;
      top: 7vw;
    }
    100% {
        left: 48.2%;
        top: 7vw;
    }
  }
</style>
