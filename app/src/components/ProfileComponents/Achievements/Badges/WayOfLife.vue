<script setup lang="ts">
import Badge from '../Badge.vue'
import Locked from '../Locked.vue'


const props = defineProps <{
  achieved: boolean,
  name: string,
  description: string,
}> ()

</script>

<template>
  <Badge :achieved="props.achieved">
    <template v-slot:front>
      <div class="contain">
        <locked v-if="props.achieved === true" />
          <img class="starIcon" src="/images/achievementsStuff/star.png" alt="">
        <div class="numb">10K</div>
      </div>
    </template>
    <template v-slot:back>
      <div class="contain">
      <h3> {{ props.name }}</h3>
      <p>{{ props.description }}</p>
      </div>
    </template>
  </Badge>
</template>


<style scoped lang="scss">

  .numb {
    padding: 2rem;
    font-size: 2rem;
    color: rgb(var(--v-theme-colorTwo));
    text-shadow: 1px 1px 1px black;
  }
  .starIcon {
    position: absolute;
    width: 280px;
    height: 220px;
    top: -50px;
    left: -40px;
    filter: drop-shadow(0 0px 5px yellow); 
    z-index: -1;
  }

</style>