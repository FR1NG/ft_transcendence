<script setup lang="ts">

const props = defineProps( {
  num:String,
})

</script>

<template>
        <div class="contain">
            <div>
                <h1 class="pongFont">PONG</h1>
            </div>
            <div class="number">{{num}}</div>
        </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');


.contain {
      min-width: 200px;
      height: 140px;
      position: relative;
      background: white;
      background-color: transparent;
      letter-spacing: 0.2em;
      display:flex;
      padding: 1rem;
      border-radius:20px 0px;
      justify-content: center;
      border: 1px solid rgba(var(--v-theme-secondary), 0.5);
      box-shadow: -5px -5px 5px -4px rgba(var(--v-theme-secondary), 0.5),
                  2px 2px 10px 0 black;
      border-bottom: 2px solid black;
      border-right: 2px solid black;
      .pongFont {
        color: rgb(var(--v-theme-secondary));
          font-size: 2.5rem;
          text-shadow: 1px 1px 2px white;
      }
      .number {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 99%;
        height: 67px;
        top:50%;
        font-size: 2em;
        background: rgba(var(--v-theme-secondary));
        border-radius: 20px 0px;
        text-shadow: 1px 1px 2px white;
        box-shadow: 0 0 2px 0 white;

      }
    }


</style>