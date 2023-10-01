<script setup lang="ts">
  defineProps<{loading: Boolean}>();
</script>
<!-- make a glass card
use javascript to lighten the hoverd area
https://www.youtube.com/watch?v=hv0rNxr1XXk
-->


<template>
  <div class="customCard">
    <div v-if="loading" class="d-flex justify-center mt-4">
      <v-progress-circular :size="80" color="colorTwo" indeterminate></v-progress-circular>
    </div>
    <slot v-else></slot>
  </div>
</template>

<style global lang="scss">
.customCard {
  background-color: rgba(var(--v-theme-colorThree), 0.2);
  border-radius: 20px;
  border: 1px solid rgb(var(--v-theme-colorThree));
  min-height: 170px;
  color: white
}
</style>
