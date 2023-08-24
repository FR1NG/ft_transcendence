<script setup lang="ts">
</script>


<!-- make a glass card
use javascript to lighten the hoverd area
https://www.youtube.com/watch?v=hv0rNxr1XXk
-->


<template>

    <div class="customCard">
      <slot></slot>
    </div>

</template>

<style global lang="scss">

.customCard{
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 15px 5px rgba(0, 0, 0, 0.4);
  min-height: 170px;
  color:white
}
</style>