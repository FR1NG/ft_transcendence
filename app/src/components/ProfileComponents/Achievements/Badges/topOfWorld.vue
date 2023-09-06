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
        <img class="bestOFFriendsIcon" src="/images/achievementsStuff/topOfWorld.png" alt="">
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
      background-color: rgb(var(--v-theme-secondary));
      
      .bestOFFriendsIcon {
        position: absolute;
        width: 240px;
        left: -22px;
        top: -25px;
        height: 180px;
        filter: drop-shadow(1px 2px 1px white); 
      }
      h3 {
        color: rgb(var(--v-theme-primary));
      }
}

</style>