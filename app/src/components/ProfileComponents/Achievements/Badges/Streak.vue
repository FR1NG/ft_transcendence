<script setup lang="ts">

const props = defineProps( {
  num:String,
  colr:String,
  fire:String
})

</script>

<template>
        <div class="contain">
            <div>
              <div class="streakNumber"><span class="hidden">...</span>{{ num }}</div>
              <img class="fire" :src=fire alt="">
                <h1 class="pongFont">PONG</h1>
            </div>
        </div>
</template>

<style scoped lang="scss">

.contain {
      position: relative;
      min-width: 200px;
      height: 140px;
      background: white;
      background-color: v-bind(colr);
      letter-spacing: 0.2em;
      border-radius:20px 5px;
      text-align: center;
      padding-top: .5rem;
      border: 1px solid v-bind(colr);
      box-shadow: -5px -5px 5px -4px v-bind(colr);
      border-bottom: 2px solid black;
      border-right: 2px solid black;
      color: rgb(var(--v-theme-secondary));
      .pongFont {
          font-size: 2.5rem;
          text-shadow: 1px 1px 2px white;
          white-space: nowrap;
      }
      .fire{
        position: absolute;
        z-index: -1;
        top: 0px;
        left: 30px;
        width: 130px;
        filter: drop-shadow(0 -5px 0px v-bind(colr)); 
      }
      .streakNumber {
        top:0;
        font-size: 2rem;
        color: v-bind(colr);
      }
      .hidden {color: transparent;}
}

</style>