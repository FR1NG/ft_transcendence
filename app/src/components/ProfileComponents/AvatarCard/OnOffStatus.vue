<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps<{
  isOnline: boolean,
  avatar: string
}>();

const backgroudCouleur = ref(props.isOnline? "rgba(93, 237, 105, 0.4)" : "rgba(245, 83, 83, 0.4)")
const fontCouleur = ref(props.isOnline? "rgb(32, 241, 32)" : "rgb(249, 7, 7)")


</script>

<template>
  <div class="status">
    <div class="dot"></div>
    <p class="statusString">{{isOnline ? 'online' : 'offline'}}</p>
  </div>
</template>

<style lang="scss">

  .status {
    position: absolute;
    background-color: v-bind(backgroudCouleur);
    width: 80px;
    height: 20px;
    display: flex;
    align-items: center;
    color: v-bind(fontCouleur);
    border-radius: 15px;
    padding: 0rem 0.2rem;
    z-index: 10;
    bottom: 10px;
    .dot {
      top:0.6rem;
      background-color: v-bind(fontCouleur);
      border-radius: 50%;
      width: 0.6rem;
      height: 0.6rem;
      margin-right: 0.5rem;
    }
  }

</style>
