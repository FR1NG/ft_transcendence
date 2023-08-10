<script lang="ts" setup>
import { Message } from '@/types/chat'
import OMessage from './OMessage.vue'
import { ref } from 'vue'

const props = defineProps<{messages: Message[]}>()
const loading = ref(false)

// for test
setTimeout(() => {
  loading.value = false
}, 3000);
</script>


<template>

  <div class="ma-2 pa-2">
    <o-message v-for="message in messages" :message="message" :loading="loading"> </o-message>
  </div>


</template>

<style lang="scss">

</style>

