<script setup lang="ts">
import axios from 'axios';
import { userInfo } from 'os';
import { ref, watch } from 'vue';


const props = defineProps<{
    user: {
        avatar: string,
        username: string,
        email: string,
        fa: boolean,
    }
}>();

const dialog = ref(props.user.fa);
const loading = ref(false);
const faCode = ref('');
const wrongCode= ref(false);

const generateQrCode = () => {
    return("/images/lock.jpg")
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
    props.user.fa = true;
  }
  else
  {
    wrongCode.value = true;
    faCode.value = '';
  }
}

watch(() => props.user.fa, (newValue, oldValue) => {
    dialog.value = newValue;
})

</script>

<template>
    <v-switch class="switch"
        prepend-icon="mdi-two-factor-authentication"
        v-model="user.fa"
        hide-details
        :label="user.fa ? `Enabled` : `Disabled`"
        :style="user.fa ? `color: rgb(var(--v-theme-colorTwo));` : `color:rgb(var(--v-theme-colorThree));`"
        @click="user.fa = !user.fa"
        ></v-switch>
        <v-form @submit.prevent="check2fa" :disabled="loading">
            <v-dialog v-model="dialog" persistent width="400">
                <v-card class="faCard" color="rgb(var(--v-theme-colorTwo))">
                    <v-card-title class="text-center" > scan me </v-card-title>
                    <v-card-text>
                        <img class="qr-code" :src="generateQrCode()" alt="qr code">
                        <v-container class="cont">
                        <v-text-field v-model="faCode" label="enter code" @keyup.enter="check2fa"></v-text-field>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="actions">
                        <v-btn type="submit" @click="check2fa">
                        enable
                        </v-btn>
                        <v-snackbar class="snack" v-model="wrongCode" location="top" timeout="4000" color="colorOne" width="100%"> invalid authenticator code</v-snackbar>
                        <v-spacer></v-spacer>
                        <v-btn type="submit" @click="user.fa = false">
                        cancel
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-form>
</template>

<style lang="scss">

.faCard {
    display: flex;
    align-items: center;
    .actions {
        margin: 0;
        width: 100%
    }
    .cont {
        height: 70px;
    }
}
.qr-code {
  width: 300px;
}
.v-overlay--active {
    backdrop-filter: blur(2px);
    background: rgba(var(--v-theme-colorTwo),0.3);
}

</style>