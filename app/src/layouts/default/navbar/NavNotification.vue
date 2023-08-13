<script setup>
import axios from '@/plugins/axios';
import { ref } from 'vue';
import { useNotificationStore } from '@/store/notification';
import { storeToRefs } from 'pinia';

const notificationStore = useNotificationStore();

const menu = ref(false);
const { notifications } = storeToRefs(notificationStore);

// calling get notification action to get user notifications
notificationStore.getNotifications();

</script>


<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      location="bottom"
      offset="5"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-icon class="notification-icon">mdi-bell-outline</v-icon>
        </v-btn>
      </template>
      <v-card min-width="300" min-height="70" max-height="300" max-width="300">
        <v-list>
          <v-list-item
            v-for="notification in notifications"
            :key="notification.id"
            :title="notification.content"
            :to="notification.link"
          >
            <!-- <template v-slot:append> -->
            <!--   <v-btn -->
            <!--     variant="text" -->
            <!--     icon="mdi-account-plus-outline" -->
            <!--   ></v-btn> -->
            <!-- </template> -->
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
