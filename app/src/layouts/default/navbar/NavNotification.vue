<script setup lang="ts">
import { ref } from 'vue';
import { useNotificationStore } from '@/store/notification';
import { storeToRefs } from 'pinia';
import type { Notification } from '@/types/notification'
import { onBeforeRouteLeave } from 'vue-router';
import { pushNotify } from '@/composables/simpleNotify';

const notificationStore = useNotificationStore();

const menu = ref(false);
const { notifications, unseenIds } = storeToRefs(notificationStore);


// calling get notification action to get user notifications
notificationStore.getNotifications().then(() => {
}).catch(()=>{});

const markRead = (value: boolean) => {
  if (!value && unseenIds.value.length !== 0)
    notificationStore.markRead(unseenIds.value).then(() => {
    }).catch((error: any) => {
    })
}

onBeforeRouteLeave(() => {
  menu.value = false;
})
</script>


<template>
  <div class="text-center">
    <v-menu v-model="menu" location="bottom" offset="5" :close-on-content-click="false" @update:model-value="markRead">
      <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-badge :dot="!unseenIds.length" :color="unseenIds.length > 0 ? `red` : `colorTwo`"
              :content="unseenIds.length || ''">
              <v-icon class="notification-icon" color="colorThree">mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>
      </template>
      <v-card min-width="300" rounded="xl" min-height="70" max-height="300" max-width="300">
        <v-list color="secodary">
          <v-list-item v-for="notification in notifications" :key="notification.id" :title="notification.content"
            :to="notification.link" :active="!notification.seen">
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<style>
.notification-icon {
  rotate: 45%;
}
</style>
