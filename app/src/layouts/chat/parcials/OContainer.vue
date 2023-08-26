<script lang="ts" setup>
import { Message } from '@/types/chat'
import OMessage from './OMessage.vue'
import { ref } from 'vue'

defineProps<{messages: Message[] | undefined}>()


// message details
let previous = '';
let init = true;
const printDetails = (value: string): boolean => {
  if(value !== previous || init){
    previous = value;
    init = false;
    return true;
  }
  return false;
}
</script>


<template>
  <div class="ma-2 pa-2" v-if="messages">
    <o-message v-for="message in messages" :printDetails="printDetails(message?.sender?.username)" :message="message" :loading="message.loading"> </o-message>
  </div>


</template>

<style lang="scss">

</style>

