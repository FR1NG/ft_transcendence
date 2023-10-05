<script lang="ts" setup>
import { ref } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router'
import { useChatStore } from '@/store/chat'
import { storeToRefs } from 'pinia';
import { bootstrap } from '@/composables/socket';
import AppBar from '../default/AppBar.vue';
import RoomsList from './parcials/RoomsList.vue'
import InfoBar from './parcials/InfoBar.vue'
import UsersList from './parcials/UsersList.vue'
import { RouterView } from 'vue-router';

// bootstrapping the socket if not initialized on home  component
bootstrap();

const route = useRoute();
const chatStore = useChatStore();
const { selectedUser, selectedRoom, users } = storeToRefs(chatStore);
const drawer = ref(window.innerWidth < 1280 ? false : true)

// getting conversations
chatStore.getConversationsUsers();

// type of the conversation (dm / room)
type Type = 'dm' | 'room';
const type = ref(route.name?.toString().toLowerCase() as Type);

onBeforeRouteUpdate((to) => {
  type.value = to.name?.toString().toLowerCase() as Type;
})

onBeforeRouteLeave(() => {
  chatStore.resetActiveConversation();
})

const tab = ref(type.value);
</script>

<template>
  <v-app id="inspire">
    <app-bar></app-bar>
    <v-navigation-drawer color="colorTwo" :rail='false' v-model="drawer">
      <v-tabs v-model="tab" color="colorOne" align-tabs="center">
        <v-tab value="dm">messages</v-tab>
        <v-tab value="room">rooms</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="dm">
          <users-list :users="users"> </users-list>
        </v-window-item>
        <v-window-item value="room">
          <rooms-list> </rooms-list>
        </v-window-item>
      </v-window>
    </v-navigation-drawer>
    <v-main :class="drawer ? `the-main` : `the-main-collapsed`">
      <router-view></router-view>
      <info-bar @click:menu="drawer = !drawer" :user="selectedUser" :room="selectedRoom" :type="type"></info-bar>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.the-main {
  background-color: rgb(var(--v-theme-colorOne));
  padding-left: 280px;
  margin-top: 10px;

  .v-toolbar {
    top: 70px !important;
    left: 270px !important;
    width: calc((100% - 280px) - 0px) !important;
    border-radius: 10px;
  }

}

@media (width<1280px) {
  .the-main {
    padding-left: 10px;
    margin-top: 10px;

    .v-toolbar {
      left: 10px !important;
      width: calc((100% - 20px) - 0px) !important;
    }
  }
}

.the-main-collapsed {
  background-color: rgb(var(--v-theme-colorOne));
  padding-left: 10px;
  margin-top: 10px;

  .v-toolbar {
    top: 70px !important;
    left: 10px !important;
    width: calc((100% - 20px) - 0px) !important;
    border-radius: 10px;
  }
}

.v-navigation-drawer {
  top: 70px !important;
  margin: 0 10px 10px 10px;
  border-radius: 10px;
  height: calc((100% - 77px) - 0px) !important;
}
</style>
