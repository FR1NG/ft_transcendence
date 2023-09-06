<script setup lang="ts">
import Badge from '../Badge.vue'
import Locked from '../Locked.vue'

const props = defineProps<{
  achieved: boolean
  num:String,
  name: string,
  description: string,
}>()

</script>

<template>
  <Badge :achieved="props.achieved">
    <template v-slot:front>
      <div class="contain">
          <locked v-if="props.achieved === true" />
          <h1 class="pongFont">PONG</h1>
          <div class="number">{{ props.num }}</div>
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
    .pongFont {
      padding-top: 0;
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
      border-radius: 0 0 20px 20px;
      text-shadow: 1px 1px 2px white;
      box-shadow: 0 0 2px 0 white;

    }
}
</style>