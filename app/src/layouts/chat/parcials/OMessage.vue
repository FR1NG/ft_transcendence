<script setup lang="ts">
import { Message } from '@/types/chat'
import { onMounted, ref } from 'vue'
import { useChatStore } from '@/store/chat';
import { User } from '@/types/user';

defineProps<{
  message: Message,
  printDetails: boolean
 // user: User,
  loading: boolean | undefined
}>()

const chatStore = useChatStore();
onMounted(() => {
  chatStore.scrollDown();
});

</script>


<template>
  <v-row>
    <v-row>
      <v-col class="message-container"  no-gutters>
        <v-list-item color="primary">
          <template v-slot:prepend class="prepend" v-if="printDetails">
            <v-btn v-if="loading" :loading="true" icon flat>mdi-circle</v-btn>
            <v-avatar v-else>
              <v-img :src="message?.sender?.avatar"></v-img>
            </v-avatar>
          </template>
          <v-list-item-title v-if="printDetails">
            {{ message?.sender?.username}}
          </v-list-item-title>
          <v-list-item-subtitle :class="message.type" color="colorOne">
            {{ message.content}}
          </v-list-item-subtitle>
          <template v-slot:append>
          </template>
        </v-list-item>
      </v-col>
    </v-row>
  </v-row>
</template>

<style lang="scss">
.message-container {
  display: flex;
}

.message {
box-shadow: 2px 1px 8px -4px #d7c5c5;
padding: 5px;
margin-top: 30px;
background: rgb(var(--v-theme-colorThree));
margin: 20px;
flex: 1;
font-size: 12px;
color: rgb(var(--v-theme-test))
}
.message-loader {
  margin: auto;
}
.v-progress-circular--size-default {
  height: 20px;
  width: 20px;
}
.message-container {
  .v-list-item__prepend {
    position: absolute !important;
    top: 5px;
  }
  .v-list-item__content {
    margin-left: 50px;
  }
}
</style>
