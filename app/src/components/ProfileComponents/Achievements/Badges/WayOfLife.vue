<script setup lang="ts">


</script>

<template>
  <div class="contain">
      <img class="masterIcon" src="/images/achievementsStuff/star.png" alt="">
    <div>10K</div>
  </div>
</template>

<style scoped lang="scss">


.contain {
      position: relative;
      min-width: 200px;
      height: 140px;
      background-color: transparent;
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
      
      .masterIcon {
        position: absolute;
        width: 280px;
        height: 220px;
        top: -50px;
        left: -40px;
        filter: drop-shadow(0 0px 5px yellow); 
        z-index: -1;
      }
}

</style>