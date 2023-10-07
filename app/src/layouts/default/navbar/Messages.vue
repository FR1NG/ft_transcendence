<script lang="ts" setup>
  import { useChatStore } from '@/store/chat';
  import { storeToRefs } from 'pinia'

  const { unreadedCount } = storeToRefs(useChatStore());
  try {
    useChatStore().getUnreadedMessagesCount();
  }
  catch (error){}
</script>

<template>
  <v-btn icon :to="{name: 'Chat'}">
    <v-badge :content="unreadedCount"  :dot="!unreadedCount" class="ma-2">
      <v-icon>mdi-message-text-outline</v-icon>
    </v-badge>
  </v-btn>
</template>
