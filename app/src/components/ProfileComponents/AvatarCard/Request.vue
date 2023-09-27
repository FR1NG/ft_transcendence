<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import { useInvitationStore } from '@/store/invitation'
import { User } from '@/types/user'
import { pushNotify } from '@/composables/simpleNotify'

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
    console.log(result);
  } catch (error) {
  }
}

// unfriend a user

const unfriend = (userId: string) => {
  userStore.unfriend(userId)
}

// invite for a geme
const inviteGame = (userId: string) => {
  useInvitationStore().createInvitation(userId, 'GAME').then((result: any) => {
    console.log('trying to change the route')
    router.push({ name: 'GameWaiting', params: { invitationId: result.id } });
  }).catch((error) => {
  });
}

// invite user for a game

</script>

<template>
  <div class="ma-8">
  <v-row>
    <v-col lg="6" cols="12">
      <v-btn :to="{ name: 'Dm', params: { id: user.id } }" block variant="outlined" rounded="lg"
        prepend-icon="mdi-message-text-outline">
        message
      </v-btn>
    </v-col>
    <v-col lg="6" cols="12">
      <v-btn class="btn text-none" rounded="lg" block variant="outlined" prepend-icon="mdi-gamepad-variant-outline"
        @click="inviteGame(user.id)">
        Game invite
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col lg="6" cols="12">
      <v-btn v-if="user.friendshipStatus === 'INVITATION_SENT'" block rounded="lg" :loading="data.sending"
        @click="cancelFriendRequest(user.invitationId)" color="colorThree" variant="flat">
        cancel request
      </v-btn>
      <v-btn v-else-if="user.friendshipStatus === 'INVITATION_RECIEVED'" block rounded="lg" :loading="data.sending"
        @click="confirmFriendInvitaion(user.invitationId)" color="secondary" variant="flat">
        confirm
      </v-btn>
      <v-btn v-else-if="user.friendshipStatus === 'FRIENDS'" block variant="outlined" rounded="lg" prepend-icon="mdi-minus"
        :loading="data.sending" @click="unfriend(user.id)">
        unfriend
      </v-btn>
      <v-btn v-else="user.friendshipStatus === 'NONE'" block variant="outlined" rounded="lg" prepend-icon="mdi-plus-thick"
        :loading="data.sending" @click="sendFrienRequest(user.id)">
        add friend
      </v-btn>
    </v-col>
    <v-col lg="6" cols="12">
      <v-btn v-if="user.blocked" @click="unblockUser" block rounded="lg" prepend-icon="mdi-lock-open-variant-outline"
        variant="outlined">
        unblock
      </v-btn>
      <v-btn v-else variant="outlined" block rounded="lg" @click="blockUser" color="colorThree"
        prepend-icon="mdi-account-cancel-outline">
        block
      </v-btn>
    </v-col>
  </v-row>
  </div>
</template>

<style lang="scss">
.interactWrapper {
  position: absolute;
  right: 0px;
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: grid;
  justify-items: end;
  gap: 0.9rem;

  .btn {
    border: 2px solid rgb(var(--v-theme-colorTwo));
    color: rgb(var(--v-theme-colorTwo));
    width: 150px;
  }

  .btn:hover {
    color: rgb(var(--v-theme-colorOne));
    font-weight: bolder;
    background-color: rgb(var(--v-theme-colorTwo));
    border: 2px solid rgb(var(--v-theme-colorTwo));
  }

  grid-template-rows: repeat(10, 1fr);
  grid-template-columns: repeat(6, minmax(0, 1fr));

  .request {
    grid-row: 5;
    grid-column: 7;
    transition: grid-column 0.5s;
  }

  .message {
    grid-row: 5;
    grid-column: 8;
    transition: grid-column 0.5s;
  }

  .gameInvite {
    grid-row: 6;
    grid-column: 8;
    transition: grid-column 0.5s;
  }

  .block {
    grid-row: 6;
    grid-column: 7;
    transition: grid-column 0.5s;
  }
}
@media (width < 1160px) {
  .interactWrapper {
    .btn {
      width: 128px;
      transition: width 0.5s;
    }
  }
}

@media (width < 1280px) {
  .v-col-12 {
    padding: 3px !important;
  }
  .v-col-lg-6 {

    padding: 10px;
  }
.v-btn--size-default {
  height: 30px !important;
}
}

@media (width < 600px) {
  .interactWrapper {
    .btn {
      width: 100px;
      font-size: 0.6rem;
      transition: width 0.5s;
    }
  }
}

@media (width < 480px) {
  .interactWrapper {
    grid-template-rows: repeat(10, 1fr);
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: .2rem;
    padding-bottom: 0.1rem;

    .request {
      grid-row: 7;
      grid-column: 8;
      transition: grid-column 0.5s;
    }

    .message {
      grid-row: 8;
      grid-column: 8;
      transition: grid-column 0.5s;
    }

    .gameInvite {
      grid-row: 9;
      grid-column: 8;
      transition: grid-column 0.5s;
    }

    .block {
      grid-row: 10;
      grid-column: 8;
      transition: grid-column 0.5s;
    }

    .btn {
      height: 20px;
    }
  }
}
</style>
