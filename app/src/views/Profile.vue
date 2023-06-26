<template>
  <v-card class="ma-4" :loading="loading" rounded="xl">
    <v-form class="pa-4">
    <v-avatar size="125" rounded="20">
      <v-img :src="profile.avatar"></v-img>
    </v-avatar>
      <v-text-field class="ma-2" label="Username" variant="outlined" v-model="profile.username"></v-text-field>
      <v-text-field class="ma-2" label="Email" variant="outlined" v-model="profile.email"></v-text-field>
    <v-card-actions>
      <v-btn color="info" variant="outlined" @click="update">Update</v-btn>
    </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { useUserStore } from '@/store/user.ts'
// import { ref } from 'vue'
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
export default {

  setup() {
    const userStore = useUserStore();
    const { loading } = storeToRefs(userStore);
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
      // console.log(profile)
    });

    const update = () => {
      //userStore.update(data)
      const { username, email } = profile;
      userStore.updateProfile({username, email}).then(response => {
        console.log(response)
      }).catch(error => {
          console.log('error')
          console.log(error)
        })
    }

    return {
      profile,
      loading,
      update
    }
  }
}
</script>
