<script setup lang="ts">
import { storeToRefs } from 'pinia';
import CreateRoom from './CreateRoom.vue'
import { useRoomStore } from '@/store/room';

const roomStore = useRoomStore();
const { drawer } = storeToRefs(roomStore);

</script>

<template>
  <v-navigation-drawer v-model="drawer" location="right" min-width="800">
    <v-list>
      <v-list-item>
        <v-text-field bg-color="grey-lighten-4" color="primary" class="rounded-pill overflow-hidden" density="compact"
          hide-details variant="solo" append-inner-icon="mdi-magnify"></v-text-field>
        <template v-slot:append>
          <create-room></create-room>
        </template>
      </v-list-item>
      <v-list-item v-for="n in 5" :key="n" :title="`Item ${n}`" link>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
