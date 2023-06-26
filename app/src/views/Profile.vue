<template>
  <v-card class="ma-4" :loading="loading" rounded="xl">
    <v-form class="pa-4">
    <v-avatar size="125" rounded="20">
      <v-img :src="profile.avatar"></v-img>
    </v-avatar>
      <v-text-field class="ma-2" label="Username" variant="outlined" v-model="profile.username"></v-text-field>
      <v-text-field class="ma-2" label="Email" variant="outlined" v-model="profile.email"></v-text-field>
    <v-card-actions>
      <v-btn :disabled="updating" :loading="updating" color="info" variant="outlined" @click="update">Update</v-btn>
    </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { useUserStore } from '@/store/user.ts'
import { ref } from 'vue'
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
export default {

  setup() {
    const userStore = useUserStore();
    const { loading } = storeToRefs(userStore);
    const updating = ref(false);

    let profile = reactive({
      avatar: "",
      username: "",
      email: "",
    });

    // getting profile
    userStore.getProfile().then(res => {
      profile.avatar = res.avatar;
      profile.username = res.username;
      profile.email = res.email;
    });

    // update profile function
    const update = () => {
      //userStore.update(data)
      updating.value = true;
      const { username, email } = profile;
      userStore.updateProfile({username, email}).then(response => {
        console.log(response)
        updating.value = false;
      }).catch(error => {
        updating.value = false;
          console.log('error')
          console.log(error)
        })
    }

    return {
      profile,
      loading,
      updating,
      update
    }
  }
}
</script>
