<script lang="ts" setup>
import { useRoomStore } from '@/store/room'
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import type { SearchedRoom } from '@/types/room'


const roomStore = useRoomStore();
const { searchedRooms, searching } = storeToRefs(roomStore);

const search = ref('');

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
    if(search.value.length != 0) {
      searching.value = true;
      return true;
    }
    return false;
  },
  set() {
    search.value = '';
  }
})

const props = defineProps<{
  join: Function
}>();

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
      bg-color="colorThree"
      color="colorThree"
      class="overflow-hidden"
      density="compact"
      hide-details
      variant="solo"
      prepend-inner-icon="mdi-magnify"
      v-model="search"
      v-bind="props"
      @keyup="handleKeyUp"
    ></v-text-field>
    </template>
    <v-card
      min-width="300"
      min-height="70"
      :loading="searching"
    >
      <v-list>
        <v-list-item  v-for="room in searchedRooms" :key="room.id" :title="room.name">
          <template v-slot:append>
            <v-btn v-if="!room.joined" @click="join(room)">join</v-btn>
          </template>
        </v-list-item>
        <v-list-item v-if="!searching && searchedRooms.length === 0">no result found</v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
