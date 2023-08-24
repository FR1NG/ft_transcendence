<script setup lang="ts">


</script>

<template>
  <div class="contain">
      <img class="bestOFFriendsIcon" src="/images/achievementsStuff/topOfWorld.png" alt="">
  </div>
</template>

<style scoped lang="scss">


.contain {
      position: relative;
      min-width: 200px;
      height: 140px;
      background-color: rgb(var(--v-theme-secondary));
      border-radius:20px 5px;
      border: 1px solid rgba(var(--v-theme-secondary), 0.5);
      box-shadow: -5px -5px 5px -4px rgba(var(--v-theme-secondary), 0.5),
                  2px 2px 10px 0 black;
      border-bottom: 2px solid black;
      border-right: 2px solid black;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: rgb(var(--v-theme-secondary));
      text-shadow: 1px 1px 1px black;
      
      
      .bestOFFriendsIcon {
        position: absolute;
        width: 240px;
        left: -25px;
        top: -25px;
        height: 180px;
        filter: drop-shadow(3px 2px 1px red); 
      }
}

</style>