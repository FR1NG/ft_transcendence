<script setup lang="ts">
import CustomCard from '@/components/CustomCard.vue';


</script>

<template>
  <v-card elevation="4" class="homeContainer">
    <div class="playGame">
      <div class="play">
        <p>"Ready to test your reflexes and paddle your way to victory?"</p>
        <button class="playButton"> Play now </button>
      </div>
      <img class="pongGif" src="/images/ppong.gif" alt="pong gif">
    </div >
    <CustomCard class="topPlayers">top Players</CustomCard >
    <div class="liveAndRooms">
      <CustomCard class="live">live games</CustomCard >
      <CustomCard class="rooms"> Popular rooms</CustomCard >
    </div>
  </v-card>

</template>


<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Gugi&display=swap');

::-webkit-scrollbar {
  display: none;
}
.homeContainer {
  font-family: 'Gugi', cursive;
  position: relative;
  display: grid;
  height: 93vh;
  gap: 1rem;
  overflow: scroll;
  padding: 0 1rem;

  .playGame {
    position: relative;
    display: flex;
    min-height: 150px;
    color: rgb(var(--v-theme-secondary));

    .play {
      z-index: 1;
      margin: 50px;
      width: 30%;
      display: grid;
      .playButton {
        margin-top: 0;
        margin-left: 43%;
        border: 2px solid;
        width: 200px;
        border-radius: 5px;
        font-size: 2rem;
        color: white;
        background-color: rgb(var(--v-theme-secondary));
        animation: change 3s linear forwards infinite;
      }
    }
    @keyframes change {
      100% {
        color: rgb(var(--v-theme-primary));
        background-color: rgb(var(--v-theme-primary));
      }
      
    }
    .pongGif {
      position: absolute;
      background-color: red;
      width: 60%;
      height: 100%;
      right: 0;
      border-radius: 0px 20px 20px 0px;
    }
  }
  .liveAndRooms {
    height: 130%;
    display: flex;
    gap: 1rem;
    .live,
    .rooms{
      width: 100%;
    }

  }


}

</style>
