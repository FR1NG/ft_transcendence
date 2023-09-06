<script setup lang="ts">
import Badge from '../Badge.vue'
import locked from '../Locked.vue'

const props = defineProps<{
  achieved:boolean,
  name: string,
  description: string
}>()


</script>

<template>
  <Badge :achieved="props.achieved">
    <template v-slot:front>
      <div class="contain">
        <locked v-if="props.achieved === true" />
        <h1 class="pongFont">PONG</h1>
        <img class="lightning" src="/images/achievementsStuff/lightning.png" alt="lightning">
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
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');



.contain {
      background-color: rgba(218, 165, 32, 0.2);
      border: 1px solid rgba(218, 165, 32, 0.2);
      box-shadow: 0px 0px 2px 1px rgba(218, 165, 32, 0.2);
      .lightning {
        position: absolute;
        width: 150px;
        height: 160px;
        top: -10px;
        left: 60px;
        z-index: -1;
      }
    }

</style>