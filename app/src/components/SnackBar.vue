<template>
  <v-snackbar v-model="open" location="top" position="sticky" timeout="-1">
    <v-card flat color="transparent">
      <v-card-subtitle>
        {{ title }}
      </v-card-subtitle>
      <v-card-text>
        {{ message }}
      </v-card-text>
    </v-card>

    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="close()">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSnackBarStore } from '@/store/snackbar'

const snackBarStore = useSnackBarStore();
const { open, message, title } = storeToRefs(snackBarStore);
const { close } = snackBarStore;
</script>
