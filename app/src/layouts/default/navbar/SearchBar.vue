<script setup lang="ts">
  import { reactive, defineProps, computed } from 'vue';
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia';

  const userStore = useUserStore();

  const props = defineProps({
    binds: {}
  });

  const search = computed({
    // getter
    get() {
      return userStore.search;
    },
    set(value) {
      userStore.search = value;

    }
  });

  const loader = computed({
    // getter
    get() {
      return userStore.searchLoader;
    },
    set(value) {
      userStore.searchLoader = value;

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
    userStore.searchUsers(search.value);
  }

  const handlekeyUp = () => {
    userStore.clearSearch()
    loader.value = true
    clearTimeout();
    setTimeout();
  }

</script>

<template>
      <v-text-field
        class="min-with-100"
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
</template>
