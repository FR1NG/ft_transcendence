<script lang="ts" setup>
import { Message } from '@/types/chat'
import OMessage from './OMessage.vue'
import { useChatStore } from '@/store/chat';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

const props = defineProps<{messages: Message[] | undefined, messagesCount: Number, type: 'dm'|'room'}>()

const { blocked } = storeToRefs(useChatStore());
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

const loadMoreLoader = ref(false);

const loadMore = async () => {
  loadMoreLoader.value = true;
  await useChatStore().loadMore(props.type);
  loadMoreLoader.value = false;
}
</script>


<template>
  <div class="ma-2 pa-2" v-if="messages">
    <v-btn variant="text" @click="loadMore" :loading="loadMoreLoader" class="ma-4" v-if="messagesCount > messages.length">load more</v-btn>
      <o-message v-for="message in messages" :printDetails="printDetails(message)" :message="message" :loading="message.loading"> </o-message>
  </div>
</template>

<style lang="scss">

</style>

