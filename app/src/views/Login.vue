<script setup lang="ts">
  import axios from 'axios';
  import CustomCard from '@/components/CustomCard.vue';
  import { reactive, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  import { useUserStore } from '@/store/user'


  const route = useRoute();

  const attemptinLoginWithIntra = ref(false)
  const dialog = ref(false)
  const loading = ref(false)
  const wrongCode = ref(false);// for the error notification
  const faCode = ref('');

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
    authStore.attemptLogin(code); // need to remove the redirect from here if there is 2fa
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    // if(user.value.authenticate) // should add an authenticate boolean
      dialog.value = true;
}


const check2fa = async () => {
  const data = new FormData();
  loading.value = true;
  data.append('2fa', faCode.value);
  try {
    const result = await axios.post('/user/authenticate', data); // checking if the code is correct
    callback(result);
  } catch (error) {
    loading.value = false;
  }
}

const callback = async (response: any) => {
  if(response.data.authenticated) {
    authStore.redirect();
  }
  else
  {
    wrongCode.value = true;
    faCode.value = '';
  }
}

</script>


<template>
  <div class="loginWrapper">
    <CustomCard class="card" :loading="false">
      <v-container>
        <form v-if="!attemptinLoginWithIntra">
          <v-text-field variant="outlined" v-model="state.name" label="username" required></v-text-field>
          <v-text-field variant="outlined" v-model="state.email" label="password" type="password" required></v-text-field>
          <v-card-actions>
            <v-btn variant="outlined" color="colorTwo">Login</v-btn>
          </v-card-actions>
          <v-divider thinkness="50" color="white" class="my-4"></v-divider>
        </form>
        <v-btn block variant="outlined" color="colorTwo" :loading="attemptinLoginWithIntra"
          :disabled="attemptinLoginWithIntra" :href="intra_url">
          login with intra
        </v-btn>
      </v-container>
    </CustomCard>
  </div >
</template>


<style lang="scss">

.loginWrapper {
  position: relative;
  height: 100%;
  background-color: rgb(var(--v-theme-colorOne));
  display: flex;
  justify-content: center;
  .card {
    color: rgb(var(--v-theme-colorTwo));
    width: 80%;
    max-height: 350px;
  }
.v-overlay--active {
    backdrop-filter: blur(2px);
    background: rgba(var(--v-theme-colorTwo),0.3);
}
}
.snack {
  animation: fade-at-leave 0.8s linear forwards 3200ms;
}

@keyframes fade-at-leave {
  100% {
    opacity: 0;
  }
}
</style>

