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
    console.log(error)
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
    <CustomCard class="card">
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
          :disabled="attemptinLoginWithIntra" :href="intra_url"  @click="dialog = !dialog">
          login with intra
        </v-btn>

      <v-form @submit.prevent="check2fa" :disabled="loading">
        <v-dialog overlay-color="red" overlay-opacity="1" v-model="dialog" persistent width="400" backgound="red">
          <v-card color="rgb(var(--v-theme-colorTwo))">
            <v-card-title class="text-center" > Authenticate </v-card-title>
            <v-card-text>
              <v-container>
                <v-text-field v-model="faCode" label="one-time code" @keyup.enter="check2fa"></v-text-field>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn type="submit" @click="check2fa" :loading="loading">
                login
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn type="submit" @click="dialog=false">
                cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
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
}

</style>

