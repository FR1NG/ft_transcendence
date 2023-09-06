<script setup lang="ts">
import { ref } from 'vue';
import { useNotificationStore } from '@/store/notification';
import { storeToRefs } from 'pinia';
import type { Notification } from '@/types/notification'

const notificationStore = useNotificationStore();

const menu = ref(false);
const { notifications, unseenIds } = storeToRefs(notificationStore);


// calling get notification action to get user notifications
notificationStore.getNotifications().then(() => {
});

const markRead = () => {
  if(unseenIds.value.length !== 0)
  notificationStore.markRead(unseenIds.value).then(() => {
  }).catch((error) => {
      console.log(error)
    })
}

</script>


<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      location="bottom"
      offset="5"
      :close-on-content-click="false"
      @update:model-value="markRead"
    >
      <template v-slot:activator="{ props }">
        <v-card class="ma-2">
        <v-btn v-bind="props" icon>
            <v-badge color="red" :content="unseenIds.length">
              <v-icon class="notification-icon" color="colorThree">mdi-bell-outline</v-icon>
            </v-badge>
        </v-btn>
        </v-card>
      </template>
      <v-card min-width="300" min-height="70" max-height="300" max-width="300">
        <v-list>
          <v-list-item
            v-for="notification in notifications"
            :key="notification.id"
            :title="notification.content"
            :to="notification.link"
          >
          </v-list-item>
        </v-list>
        <!-- <v-list v-else> -->
        <!--   <v-list-item v-if="!searchLoader" title="no result"></v-list-item> -->
        <!-- </v-list> -->
      </v-card>
    </v-menu>
  </div>
</template>

<style>
.notification-icon {
  rotate: 45%;
}

</style>
