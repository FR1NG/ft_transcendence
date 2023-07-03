<template>
    <v-snackbar
      v-model="open"
      location="top"
      position="sticky"
      timeout="-1"
    >
      {{ message }}

      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="close()"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { useSnackBarStore } from '@/store/snackbar'

  const snackBarStore = useSnackBarStore();
  const { open, message } = storeToRefs(snackBarStore);
  const { close } = snackBarStore;
</script>
