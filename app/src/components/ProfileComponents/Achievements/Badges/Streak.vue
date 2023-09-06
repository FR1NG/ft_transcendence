<script setup lang="ts">
import Locked from '../Locked.vue'
import Badge from '../Badge.vue'
const props = defineProps<{
  num:string,
  colr:string,
  fire:string,
  name:string,
  description:string,
  achieved:boolean,
}>()

</script>


<template>
  <Badge :achieved="props.achieved">
    <template v-slot:front>
      <div class="contain">
        <locked  v-if="props.achieved === true"/>
        <div class="streakNumber"><span class="hidden">..........</span>{{ props.num }}</div>
          <img class="fire" :src=props.fire alt="">
          <h1 class="pongFont">PONG</h1>
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

.contain {
      background-color: v-bind(colr);
      border: 1px solid v-bind(colr);
      box-shadow: -1px -1px 1px 0px v-bind(colr);
    
      .pongFont {
        padding-top: 0;
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
      p {
        color: white;
        padding-top: 1rem;
      }

}

</style>