
<script setup lang="ts">
import SearchBar from './SearchBar.vue'
import { storeToRefs } from 'pinia';
import { useSearchStore } from '@/store/search'
import { reactive } from 'vue'

const searchStore = useSearchStore();
const { searchedUsers, isUserSerched, searchLoader } = storeToRefs(searchStore);
const props = defineProps<{

}>({
  loading: false,
  to: {},

});

type SearchedUser =  {
  id: string
  username: string
  avatar: string
  email: string
}

const data = reactive({
  loaded : false,
  menu: true,
})


</script>



<template>
  <div class="text-center">
    <v-menu
      v-model="isUserSerched"
      location="bottom"
      :open-on-click="false"
      :close-on-click="false"
      offset="5"
    >
      <template v-slot:activator="{ props }">
        <SearchBar :binds="props"/>
      </template>
      <v-card min-width="300" min-height="70" :loading="loading">
        <v-list v-if="searchedUsers.length > 0">
          <slot name="elements"> </slot>
        </v-list>
        <v-list v-else>
          <v-list-item v-if="!loading" title="no result"></v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
