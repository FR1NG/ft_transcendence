<script setup lang="ts">
  import { computed } from 'vue';
  import { useSearchStore } from '@/store/search';
  import { onBeforeRouteLeave } from 'vue-router'

  const searchStore = useSearchStore();

  const props = defineProps({
    binds: {}
  });

  const search = computed({
    // getter
    get() {
      return searchStore.search;
    },
    set(value) {
      searchStore.search = value;

    }
  });

  const loader = computed({
    // getter
    get() {
      return searchStore.searchLoader;
    },
    set(value) {
      searchStore.searchLoader = value;

    }
  });
  // const { search } = storeToRefs(userStore);
  let timeoutval: any;
  const setTimeout = () => {
    timeoutval = window.setTimeout(() => {
      handleSearch()
    }, 500);
  }

  const clearTimeout = () => {
    window.clearTimeout(timeoutval)
  }

  const handleSearch = () => {
    try {
      searchStore.searchUsers(search.value);
  }
  catch (error){}
  }

  const handlekeyUp = () => {
    searchStore.clearSearch()
    loader.value = true
    clearTimeout();
    setTimeout();
  }

  // before changing the route event
  onBeforeRouteLeave(() => {
    searchStore.clearSearch();
    search.value = '';
  })

</script>

<template>
  <v-card>
      <v-text-field
        class="search-bar"
        variant="solo"
        density="compact"
        placeholder="search user"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        flat
        v-bind="binds"
        v-model="search"
        @click:append-inner="handleSearch"
        @keyup="handlekeyUp"
      ></v-text-field>
  </v-card>
</template>

<style lang="scss">
@import 'vuetify/_settings.scss';

@media #{map-get($display-breakpoints, 'sm-and-down')} {
    .search-bar {
        display: none;
    }
}

.search-bar {
  width: 200px;
  padding: 2px;
}
</style>
