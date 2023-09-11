<script setup lang="ts">
import SearchBar from './SearchBar.vue'
import { storeToRefs } from 'pinia';
import { useSearchStore } from '@/store/search'
import { ref } from 'vue'
import { onMounted } from 'vue';

const searchStore = useSearchStore();
const { searchedUsers, searchLoader } = storeToRefs(searchStore);
const value = ref(false);

defineProps({
  minWidth: {
    type: String ,
    default: '300'
  },
  minHeight: {
    type: String,
    default: '70'
  },
  maxHeight: {
    type: String,
    default: '600'
  },
})


const handleOnChange = (newVal: boolean) => {
  value.value = newVal
}

// exposing the handle search to the parent
const child = ref();
const handleSearch = ref<Function>();
onMounted(() => {
  handleSearch.value = child?.value.handleSearch;
})

defineExpose({
  handleSearch
});

</script>



<template>
  <div class="text-center">
    <v-menu
      v-model="value"
      location="bottom"
      :open-on-click="false"
      :close-on-click="false"
      :close-on-content-click="false"
      offset="5"
      min-width="200"
    >
      <template v-slot:activator="{ props }">
        <SearchBar ref="child" :binds="props" @change="handleOnChange"/>
      </template>
      <v-card :min-width="minWidth" :min-height="minHeight" :max-height="maxHeight" :loading="searchLoader">
        <v-list v-if="searchedUsers.length > 0">
          <slot name="items" :users="searchedUsers">
          </slot>
        </v-list>
        <v-list v-else>
          <v-list-item v-if="!searchLoader" title="no result"></v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
