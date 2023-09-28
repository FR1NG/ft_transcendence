<script setup lang="ts">
import { Message } from '@/types/chat'
import { onMounted, ref } from 'vue'
import { useChatStore } from '@/store/chat';
import { User } from '@/types/user';
import moment from 'moment';
const props = defineProps<{
  message: Message,
  printDetails: boolean
  loading: boolean | undefined
}>()

const chatStore = useChatStore();
const time = ref(moment(props.message.created_at).fromNow())
onMounted(() => {
  chatStore.scrollDown();
});

setInterval(() => {
time.value = moment(props.message.created_at).fromNow()
}, 60000);

</script>


<template>
  <v-row>
    <v-row>
      <v-col class="message-container"  no-gutters>
        <v-list-item class="message" color="colorFoure">
          <template v-slot:prepend class="prepend" v-if="printDetails">
            <v-avatar>
              <v-img :src="message?.sender?.avatar"></v-img>
            </v-avatar>
          </template>
          <v-list-item-title color="colorFoure" v-if="printDetails">
            {{ message?.sender?.username}}
            <div class="time">
             {{ time }}
            </div>
          </v-list-item-title>
          <v-list-item-subtitle class="content">
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

.content {
  color: rgb(var(--v-theme-colorFoure));
  padding: 5px !important;
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
.time {
    font-size: 10px;
    padding: 0;
    margin-top: -8px;
}
</style>
