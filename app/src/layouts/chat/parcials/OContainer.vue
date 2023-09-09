<script lang="ts" setup>
import { Message } from '@/types/chat'
import OMessage from './OMessage.vue'

const props = defineProps<{messages: Message[] | undefined}>()

// message details
let previous = '';
const printDetails = (message: Message): boolean => {
  if(typeof props.messages !== 'undefined' && props.messages[0].id === message.id) {
    previous = message.sender.id
    return true;
  }
  if(!message.sender)
    return true
  if(previous !== message.sender.id || previous === ''){
    previous = message.sender.id;
    return true;
  }
  return false;
}
</script>


<template>
  <div class="ma-2 pa-2" v-if="messages">
    <o-message v-for="message in messages" :printDetails="printDetails(message)" :message="message" :loading="message.loading"> </o-message>
  </div>


</template>

<style lang="scss">

</style>

