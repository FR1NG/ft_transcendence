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
      <locked v-if="props.achieved === true" />
      <div class="contain">
          <img class="bestOFFriendsIcon" src="/images/achievementsStuff/bestOfFriends.png" alt="">
      </div>
    </template>
    <template v-slot:back>
      <div class="contain backContain">
      <h3> {{ props.name }}</h3>
      <p>{{ props.description }}</p>
      </div>
    </template>
  </Badge>
</template>

<style scoped lang="scss">
.contain {
  background-color: none;
  border: none;
  box-shadow: none;
  .bestOFFriendsIcon {
    position: absolute;
    width: 258px;
    height: 181px;
    left: -29px;
    top: -20px;
    filter: drop-shadow(0 0px 1px yellow); 
  }
}
.backContain {
  background-color: goldenrod;
  border: 1px solid yellow;
  box-shadow: 0px 0px 5px 0.1px yellow;
  }

</style>