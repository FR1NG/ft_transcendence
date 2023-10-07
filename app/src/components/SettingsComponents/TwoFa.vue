<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import { pushNotify } from '@/composables/simpleNotify';

const props = defineProps<{
  user: {
    avatar: string,
    username: string,
    email: string,
    isOtpActivated: boolean,
  }
}>();


const dialog = ref(false);
const loading = ref(false);
const faCode = ref('');
const qrCode = ref('')
const authStore = useAuthStore();
const errorMessage = ref('');
const tfa = ref(props.user.isOtpActivated);
const input = ref<any>(null);

const hide = () => {
  loading.value = false;
  dialog.value = false;
  faCode.value = '';
  qrCode.value = '';
  errorMessage.value = '';
}

const enable = async () => {
  loading.value = true;
  errorMessage.value = '';
  authStore.enableTwoFactor(faCode.value).then((result: any) => {
    hide()
  }).catch((error) => {
      errorMessage.value = error.data?.errors?.code;
      loading.value = false;
      faCode.value = '';
  })
}


const disable = async () => {
  loading.value = true;
  errorMessage.value = '';
  authStore.disableTwoFactor(faCode.value).then((result: any) => {
    hide()
  }).catch((error) => {
    errorMessage.value = error.data?.errors?.code;
    loading.value = false;
    faCode.value = '';
  })
}

const getQrCode = async () => {
  authStore.getQr().then((result: any) => {
    qrCode.value = result.image
  }).catch(() => {})
}

const focus = (value: boolean) => {
  if(value)
    input.value?.focus();
}

watch(() => tfa.value, (newValue) => {
  if(newValue != props.user.isOtpActivated)
    dialog.value = true;
  if (newValue && !props.user.isOtpActivated) {
    getQrCode();
  }
})

const close = () => {
  tfa.value = props.user.isOtpActivated;
  dialog.value = false;
}

</script>

<template>
  <v-switch class="switch" prepend-icon="mdi-two-factor-authentication" v-model="tfa" hide-details
    :label="user.isOtpActivated ? `Enabled` : `Disabled`"
    :style="user.isOtpActivated ? `color: rgb(var(--v-theme-colorTwo));` : `color:rgb(var(--v-theme-colorThree));`"></v-switch>
    <v-dialog v-model="dialog" persistent width="400" @update:model-value="focus">
      <v-card class=" pa-3" color="colorOne" rounded="xl">
        <v-card-title class="text-center"> scan me </v-card-title>
        <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-img v-if="tfa" :src="qrCode" alt="qr code"></v-img>
          </v-col>
        </v-row>
        <v-row  class="d-flex justify-center">
          <v-col cols="12">
            <v-text-field ref="input" :error-messages="errorMessage" v-model="faCode" label="enter code"></v-text-field>
          </v-col>
        </v-row>
        </v-card-text>
        <v-card-actions class="actions">
          <v-btn v-if="tfa" type="submit" @click="enable">
            enable
          </v-btn>
          <v-btn v-else @click="disable">
            disable
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn type="submit" @click="close">
            cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<style lang="scss">
/* .faCard { */
/*   display: flex; */
/*   align-items: center; */

/*   .actions { */
/*     margin: 0; */
/*     width: 100% */
/*   } */

/*   .cont { */
/*     height: 70px; */
/*   } */
/* } */

/* .qr-code { */
/*   width: 300px; */
/* } */

</style>
