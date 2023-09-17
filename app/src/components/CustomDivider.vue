<script setup lang="ts">

const props = defineProps({
  title: String,
});
</script>

<template>

    <div class="divider">
        <h4 class="dividerTitle">{{title}}</h4>
        <v-divider thickness="3"  class="dividerLine"></v-divider>
    </div>

</template>

<style lang="scss">

.divider {
  margin: 1rem 0rem 1rem 1rem;
  display: flex;
  align-items: center;

  .dividerTitle {
    width: fit-content;
    margin-right: 1rem;
    white-space: nowrap;
  }
  .dividerLine {
    border-color: white;
    border-radius: 20px;
  }
}

</style>