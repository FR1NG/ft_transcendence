<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { onMounted } from 'vue';

const dialog = ref(true)
const loading = ref(false);
const code = ref('')
const errorMessage = ref('')
const authStore = useAuthStore();
const input = ref<any>(null);


const virify = () => {
  authStore.otpVirify(code.value).catch((error: any) => {
    errorMessage.value = error.errors?.code;
  });
}

const cancel = () => {
  authStore.logout();
}

onMounted(() => {
  input.value?.focus();
});

</script>

<template>
      <v-form @submit.prevent="virify" :disabled="loading">
        <v-dialog overlay-color="red" overlay-opacity="1" v-model="dialog" persistent width="400" backgound="colorTwo">
          <v-card color="colorOne" rounded="xl">
            <v-card-title class="text-center" > Authenticate </v-card-title>
            <v-card-text>
              <v-container>
                <v-text-field ref="input" :error-messages="errorMessage" v-model="code" label="one-time code" @keyup.enter="virify"></v-text-field>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn type="submit" @click="virify" :loading="loading">
                Virify
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="cancel">
                cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
</template>
