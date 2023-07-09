<template>
  <v-card rounded="xl" class="ma-4 pa-4" min-height="500">
    <v-container>
      <form v-if="!attemptinLoginWithIntra">
        <v-text-field variant="outlined" v-model="state.name" label="username" required></v-text-field>

        <v-text-field variant="outlined" v-model="state.email" label="password" type="password" required></v-text-field>

        <v-card-actions>
          <v-btn variant="outlined" color="primary">Login</v-btn>
        </v-card-actions>

        <v-divider thinkness="50" color="success" class="my-4"></v-divider>
      </form>
      <v-btn block variant="outlined" color="primary" :loading="attemptinLoginWithIntra"
        :disabled="attemptinLoginWithIntra" :href="intra_url">
        login with intra
      </v-btn>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// import { useVuelidate } from '@vuelidate/core'
// import { email, required } from '@vuelidate/validators'
const route = useRoute();

const attemptinLoginWithIntra = ref(false)

const initialState = {
  username: '',
  email: '',
}

const state = reactive({
  ...initialState,
})

const intra_url = import.meta.env.VITE_INTRA_LOGIN_URL;
const authStore = useAuthStore();
const code = route.query.code;
if (code) {
  attemptinLoginWithIntra.value = true;
  authStore.attemptLogin(code);
}
</script>
