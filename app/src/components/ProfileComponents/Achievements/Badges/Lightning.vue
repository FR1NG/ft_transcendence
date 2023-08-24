<script setup lang="ts">
</script>

<template>
        <div class="contain">
            <div>
                <h1 class="pongFont">PONG</h1>
                <img class="lightning" src="/images/achievementsStuff/lightning.png" alt="lightning">
            </div>
        </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');



.contain {
      position: relative;
      min-width: 200px;
      height: 140px;
      background: white;
      background-color: rgba(218, 165, 32, 0.2);
      letter-spacing: 0.2em;
      border-radius:20px 5px;
      text-align: center;
      padding-top: 2.5rem;
      border: 1px solid rgba(218, 165, 32, 0.2);
      box-shadow: 0px 0px 5px 1px rgba(218, 165, 32, 0.2);
      .pongFont {
        color: rgb(var(--v-theme-secondary));
          font-size: 2.5rem;
          text-shadow: 1px 1px 2px white;
          white-space: nowrap;
      }
      .lightning {
        position: absolute;
        width: 150px;
        height: 160px;
        bottom: 0;
        left: 60px;
        z-index: -1;
      }
    }

</style>