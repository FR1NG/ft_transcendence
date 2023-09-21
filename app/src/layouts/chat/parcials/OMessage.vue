<script setup lang="ts">
import { Message } from '@/types/chat'
import { onMounted, ref } from 'vue'
import { useChatStore } from '@/store/chat';
import { User } from '@/types/user';

defineProps<{
  message: Message,
  printDetails: boolean
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
        <v-list-item class="message">
          <template v-slot:prepend class="prepend" v-if="printDetails">
            <v-btn v-if="loading" :loading="true" icon flat>mdi-circle</v-btn>
            <v-avatar v-else>
              <v-img :src="message?.sender?.avatar"></v-img>
            </v-avatar>
          </template>
          <v-list-item-title v-if="printDetails">
            {{ message?.sender?.username}}
          </v-list-item-title>
          <v-list-item-subtitle class="content left bubble">
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
.message {
  color: rgb(var(--v-theme-colorFoure));
}

.message-loader {
  margin: auto;
}
.v-progress-circular--size-default {
  height: 20px;
  width: 20px;
}
.message-container {
  display: flex;
  padding: 8px !important;
  .v-list-item__prepend {
    position: absolute !important;
    top: 5px;
  }
  .v-list-item__content {
    margin-left: 50px;
  }
}


.content {
    background-color: #5f4c4c;
    padding: 4px 8px;
    border-radius: 0px 8px 8px 8px;
}
</style>
