<script setup lang="ts">
import Badge from '../Badge.vue'
import locked from '../Locked.vue'

const props = defineProps<{
  content: string
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
        <h1 class="pongFont">{{content}}</h1>
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

<style lang="scss">

.contain {
  background-color: transparent;
}
</style>
