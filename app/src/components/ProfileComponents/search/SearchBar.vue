<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useSearchStore } from '@/store/search';
import { onBeforeRouteUpdate } from 'vue-router'

const searchStore = useSearchStore();

defineProps({
  binds: {},
});

const emit = defineEmits(['change'])

const handleSearch = () => {
  if(search.value.length > 0)
    searchStore.searchUsers(search.value);
}

defineExpose({
  handleSearch
});

const search = ref('');

const loader = computed({
  // getter
  get() {
    return searchStore.searchLoader;
  },
  set(value) {
    searchStore.searchLoader = value;
  }
});

let timeoutval: any;
const setTimeout = () => {
  timeoutval = window.setTimeout(() => {
    handleSearch()
  }, 500);
}

const clearTimeout = () => {
  window.clearTimeout(timeoutval)
}

const handlekeyUp = () => {
  searchStore.clearSearch()
  loader.value = true
  clearTimeout();
  setTimeout();
}

// before changing the route event
onBeforeRouteUpdate(() => {
  searchStore.clearSearch();
  search.value = '';
})

watch(() => search.value, (newValue, oldValue) => {
  if (oldValue.length > 0 && newValue.length === 0)
    emit('change', false);
  else if (newValue.length > 0 && oldValue.length === 0)
    emit('change', true);
})

const handleClick = () => {
  emit('change', true);
  handleSearch()
}

</script>

<template>
  <v-text-field
    variant="outlined"
    class="mx-4"

    density="compact"
    placeholder="search user"
    append-inner-icon="mdi-magnify"
    single-line
    hide-details
    flat
    v-bind="binds"
    v-model="search"
    @click:append-inner="handleClick"
    @keyup="handlekeyUp"
    ></v-text-field>
</template>

<style lang="scss">
@import 'vuetify/_settings.scss';

/* @media #{map-get($display-breakpoints, 'sm-and-down')} { */
/*   .search-bar { */
/*     display: none; */
/*   } */
/* } */

/* .search-bar { */
/*   width: 200px; */
/*   padding: 2px; */
/* } */
</style>
