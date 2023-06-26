<template>
  <div>
    <v-card>
        <v-progress-circular
          :size="70"
          :width="7"
          color="purple"
          indeterminate
        ></v-progress-circular>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth.ts'
export default {
  setup() {
    const route = useRoute();
    const auth = useAuthStore();

    console.log('attempting login')
    auth.attemptLogin(route.query.code);
  }
}
</script>
