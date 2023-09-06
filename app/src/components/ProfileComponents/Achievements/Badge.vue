<script setup lang="ts">

import locked from './Locked.vue'

const props = defineProps<{
  achieved:boolean,
}>()

let delay = "0.7s"
if (props.achieved === false)
    delay = "0s"


</script>

<template>
  <div class="containner">
    <div class="badge">
        <div class="front">
            <slot name="front"></slot>
        </div>
        <div class="back">
            <slot name="back"></slot>
        </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.containner {
  min-width: 200px;
  height: 140px;
  perspective: 800px;
}
.containner:hover > .badge{
  cursor: pointer;
  transform: rotateY(180deg) rotateZ(180deg);
}

.badge {
  position:relative;
  width: 100%;
  height: 100%;
  transition: transform 1s;
  transition-delay: v-bind(delay);
  transform-style: preserve-3d ;
}

.front,
.back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius:20px;
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg) rotateZ(180deg);
}

</style>