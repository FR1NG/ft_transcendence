<script lang="ts" setup>
import { useRoomStore } from '@/store/room'
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { computed } from 'vue';


const roomStore = useRoomStore();
const search = ref('');
const list = ref(true);
const { searchedRooms } = storeToRefs(roomStore);

let timeoutValue: any;

const handleKeyUp = () => {
  clearTimeout();
  setTimeout();
}

const handleSearch = () => {
  roomStore.searchRoom(search.value);
}

const setTimeout = () => {
  timeoutValue = window.setTimeout(() => {
    handleSearch();
  }, 500);
}

const clearTimeout = () => {
  window.clearTimeout(timeoutValue);
}

// appearance
const appearance = computed({
  get() {
    return search.value.length != 0;
  },
  set() {
    // do nothing
  }
})
</script>

<template>
  <v-menu
      location="bottom"
      :open-on-click="false"
      :close-on-click="false"
      offset="5"
    v-model="appearance"
  >
    <template v-slot:activator="{ props }">
    <v-text-field
      bg-color="grey-lighten-4"
      color="primary"
      class="rounded-pill overflow-hidden"
      density="compact"
      hide-details
      variant="solo"
      append-inner-icon="mdi-magnify"
      v-model="search"
      v-bind="props"
      @keyup="handleKeyUp"
    ></v-text-field>
    </template>
    <v-card
      min-width="300"
      min-height="70"
      :loading="true"
    >
      <v-list>
        <v-list-item  v-for="room in searchedRooms" :key="room.id" :title="room.name"></v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
