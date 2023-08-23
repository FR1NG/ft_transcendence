<script lang="ts" setup>
import { Message } from '@/types/chat'
import OMessage from './OMessage.vue'
import { ref } from 'vue'

defineProps<{messages: Message[]}>()


// message details
let previous = '';
const printDetails = (value: string): boolean => {
  if(value !== previous){
    previous = value;
    return true;
  }
  return false;
}
</script>


<template>
  <div class="ma-2 pa-2">
    <o-message v-for="message in messages" :printDetails="printDetails(message?.sender?.username)" :message="message" :loading="message.loading"> </o-message>
  </div>


</template>

<style lang="scss">

</style>

