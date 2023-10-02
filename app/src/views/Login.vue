<script setup lang="ts">
  import axios from 'axios';
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
    <img class="logo42" src="/images/42logo.png" alt="42 logo">
    <v-btn variant="outlined" color="colorTwo" width="250" :loading="attemptinLoginWithIntra"
      :disabled="attemptinLoginWithIntra" :href="intra_url">
      login with 42 intra
    </v-btn>
  </div >
</template>


<style lang="scss">

.loginWrapper {
  position: relative;
  height: 100%;
  background-color: rgb(var(--v-theme-colorOne));
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem;
  .logo42 {
    width: 250px;
  }

  }
</style>

