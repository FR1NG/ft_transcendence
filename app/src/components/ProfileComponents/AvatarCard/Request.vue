<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import { useInvitationStore } from '@/store/invitation'
import { User } from '@/types/user'
import { pushNotify } from '@/composables/simpleNotify'
import { useSocketStore } from '@/store/socket'

const props = defineProps<{ user: User }>()
const userStore = useUserStore();
const data = reactive({
  sending: false
});

const router = useRouter();

// notification store
// sending frien request function
const sendFrienRequest = async (userId: string) => {
  try {
    data.sending = true;
    const result = await userStore.sendFriendRequest(userId);
    data.sending = false;
  } catch (error: any) {
      data.sending = false;
      pushNotify({status:'error', title:'error', text:error.data.message})
  }
}

// cancel frien request function
const cancelFriendRequest = async (requestId: string) => {
  try {
    const result = await userStore.cancelFriendRequest(requestId);
  } catch (error: any) {
      pushNotify({status:'error', title:'error', text:error.data.message})
  }
}

// confirm friend requst
const confirmFriendInvitaion = async (invitationId: string) => {
  try {
    const result = await useInvitationStore().acceptInvitation(invitationId);
    props.user.friendshipStatus = 'FRIENDS';
    props.user.invitationId = '';
  } catch (error: any) {
  }
}

// test blocking user
const blockUser = async () => {
  try {
    userStore.blockUser(props.user.id);
    pushNotify({status:'success', title:'Action completed', text:`${props.user.username} has been blocked`});
  } catch (error: any) {
    if(error.response.status === 409)
      pushNotify({status:'warning', title:'Action stopped', text:`user is aleady blocked`})
    else
      pushNotify({status:'error', title:'error', text:`some error occured when blocking ${props.user.username}`});
  }
}

// unblock user
const unblockUser = async () => {
  try {
    const result = await userStore.unblockUser(props.user.id);
    pushNotify({status:'success', title:'Action completed', text:`${props.user.username} has been unblocked`});
  } catch (error) {
  }
}

// unfriend a user

const unfriend = (userId: string) => {
  try {
    userStore.unfriend(userId)

  } catch (error: any) {
  }
}

const inviteGame = (userId: string) => {
  useInvitationStore().createInvitation(userId, 'GAME').then((result: any) => {
    router.push({ name: 'Game'});
  }).catch(() => {

  })
}

</script>

<template>
  <div class="mt-8 mr-5 mb-8 ml-5">
  <v-row v-if="!user.blocked">
    <v-col lg="6" cols="12">
      <v-btn density="comfortable" :to="{ name: 'Dm', params: { id: user.id } }" block variant="outlined" rounded="lg"
        prepend-icon="mdi-message-text-outline">
        message
      </v-btn>
    </v-col>
    <v-col lg="6" cols="12">
      <v-btn density="comfortable" class="btn text-none" rounded="lg" block variant="outlined" prepend-icon="mdi-gamepad-variant-outline"
        @click="inviteGame(user.id)">
        Game invite
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col lg="6" cols="12"  v-if="!user.blocked">
      <v-btn density="comfortable" v-if="user.friendshipStatus === 'INVITATION_SENT'" block rounded="lg" :loading="data.sending"
        @click="cancelFriendRequest(user.invitationId)" color="colorThree" variant="flat">
        cancel request
      </v-btn>
      <v-btn density="comfortable" v-else-if="user.friendshipStatus === 'INVITATION_RECIEVED'" block rounded="lg" :loading="data.sending"
        @click="confirmFriendInvitaion(user.invitationId)" color="secondary" variant="flat">
        confirm
      </v-btn>
      <v-btn density="comfortable" v-else-if="user.friendshipStatus === 'FRIENDS'" block variant="outlined" rounded="lg" prepend-icon="mdi-minus"
        :loading="data.sending" @click="unfriend(user.id)">
        unfriend
      </v-btn>
      <v-btn density="comfortable" v-else="user.friendshipStatus === 'NONE'" block variant="outlined" rounded="lg" prepend-icon="mdi-plus-thick"
        :loading="data.sending" @click="sendFrienRequest(user.id)">
        add friend
      </v-btn>
    </v-col>
    <v-col lg="6" cols="12">
      <v-btn density="comfortable" v-if="user.blocked" @click="unblockUser" block rounded="lg" prepend-icon="mdi-lock-open-variant-outline"
        variant="outlined">
        unblock
      </v-btn>
      <v-btn density="comfortable" v-else variant="outlined" block rounded="lg" @click="blockUser" color="colorThree"
        prepend-icon="mdi-account-cancel-outline">
        block
      </v-btn>
    </v-col>
  </v-row>
  </div>
</template>

<style lang="scss" scoped>

v-btn {
  width: 300px !important;
}

@media (width < 1280px) {
  .v-col-12 {
    padding: 3px !important;
  }
  .v-col-lg-6 {

    padding: 10px;
  }
}
</style>
