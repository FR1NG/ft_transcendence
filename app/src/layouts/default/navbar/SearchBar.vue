<script setup lang="ts">
  import { reactive, defineProps } from 'vue';
  import { useUserStore } from '@/store/user'

  const userStore = useUserStore();

  const props = defineProps({
    binds: {}
  });
  const data = reactive({
    search: ''
  })

  let timeoutval;
  const setTimeout = () => {
    timeoutval = window.setTimeout(() => {
      handleSearch()
    }, 500);
  }

  const clearTimeout = () => {
    window.clearTimeout(timeoutval)
  }

  const handleSearch = () => {
    userStore.searchUsers(data.search);
  }

  const handlekeyUp = () => {
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
        v-model="data.search"
        @click:append-inner="handleSearch"
        @keyup="handlekeyUp"
      ></v-text-field>
</template>
