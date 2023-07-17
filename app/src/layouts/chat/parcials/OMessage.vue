<script setup lang="ts">
import { Message } from '@/types/chat'
defineProps<{
  message: Message,
  loading: boolean
}>()

</script>


<template>
  <v-row>
    <v-row>
      <v-col class="message-container" :offset="message.type === 'sent' ? 6 : 0" :cols="message.type !== 'sent' ? '6' : ''" no-gutters>
        <div class="message">
          <div class="message-content">
              {{ message.content }}
          </div>
         </div>
          <div class="message-loader" v-if="loading">
             <v-progress-circular indeterminate color="primary" ></v-progress-circular>
          </div>
      </v-col>
    </v-row>
  </v-row>
</template>

<style lang="css">
.message-container {
  display: flex;
}

.message {
  box-shadow: 2px 1px 8px -4px #d7c5c5;
  padding: 15px;
  margin-top: 30px;
  background: #eee;
  margin: 20px;
  flex: 1;
}
.message-loader {
  margin: auto;
}
.v-progress-circular--size-default {
  height: 20px;
  width: 20px;
}
</style>
