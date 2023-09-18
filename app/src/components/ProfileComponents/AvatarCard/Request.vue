<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { reactive, watch } from 'vue'
import { useSnackBarStore } from '@/store/snackbar'
import { useInvitationStore } from '@/store/invitation'
import { Invitation } from '@/types/invitation'

const userStore = useUserStore();
const route = useRoute()
const data = reactive({
  sending: false
});

const { user } = storeToRefs(userStore);
const router = useRouter();

// notification store
const snackBarStore = useSnackBarStore();
// sending frien request function
const sendFrienRequest = async (userId: string) => {
  try {
    data.sending = true;
    const result = await userStore.sendFriendRequest(userId);
    data.sending = false;
  } catch (error: any) {
    data.sending = false;
    useSnackBarStore().notify(error?.data?.message)
  }
}

// cancel frien request function
const cancelFriendRequest = async (requestId: string) => {
  try {
    const result = await userStore.cancelFriendRequest(requestId);
  } catch (error) {
  }
}

// confirm friend requst
const confirmFriendInvitaion = async (invitationId: string) => {
  try {
    const result = await useInvitationStore().acceptInvitation(invitationId);
    user.value.friendshipStatus = 'FRIENDS';
    user.value.invitationId = '';
  } catch (error) {
  }
}

// test blocking user
const blockUser = async () => {
  try {
    userStore.blockUser(user.value.id);
    snackBarStore.notify(`${user.value.username} has been blocked`);
  } catch (error: any) {
    snackBarStore.notify(error.response.status === 409 ? `user is aleady blocked` : `some error occured when blocking the ${user.value.username}`);
  }
}

// unblock user
const unblockUser = async () => {
  try {
    const result = await userStore.unblockUser(user.value.id);
    snackBarStore.notify(`${user.value.username} has been unblocked`);
    console.log(result);
  } catch(error) {
    console.log(error)
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
    router.push({ name: 'GameWaiting', params: { invitationId: result.id}});
  }).catch((error: any) => {
      useSnackBarStore().notify(error.data.message);
  });
}

// invite user for a game

</script>

<template>
  <div class="interactWrapper">
    <div class="message" v-if="user.id">
      <v-btn :to="{name: 'Dm', params: { id: user.id }}"  class="btn text-none" variant="outlined" rounded="lg" prepend-icon="mdi-message-text-outline">
        message
      </v-btn>
    </div>
    <div class="gameInvite">
      <v-btn class="btn text-none" rounded="lg" variant="outlined" prepend-icon="mdi-gamepad-variant-outline" @click="inviteGame(user.id)">
        Game invite
      </v-btn>
    </div>
    <div class="request">
      <div class="addFriend">
        <v-btn v-if="user.friendshipStatus === 'INVITATION_SENT'" class="btn text-none"  rounded="lg" :loading="data.sending"
        @click="cancelFriendRequest(user.invitationId)" color="colorThree" variant="flat">
        cancel request
      </v-btn>
      <v-btn v-else-if="user.friendshipStatus === 'INVITATION_RECIEVED'" class="btn text-none" rounded="lg" :loading="data.sending"
      @click="confirmFriendInvitaion(user.invitationId)" color="secondary" variant="flat">
      confirm
    </v-btn>

    <v-btn v-else-if="user.friendshipStatus === 'FRIENDS'" class="btn  text-none" variant="outlined" rounded="lg" prepend-icon="mdi-minus"
    :loading="data.sending" @click="unfriend(user.id)" >
          unfriend
  </v-btn>
    <v-btn v-else="user.friendshipStatus === 'NONE'" class="btn  text-none" variant="outlined" rounded="lg" prepend-icon="mdi-plus-thick"
    :loading="data.sending" @click="sendFrienRequest(user.id)">
    add friend
  </v-btn>
    </div>
  </div>
      <div class="block">
        <v-btn v-if="user.blocked" @click="unblockUser" class="btn text-none" rounded="lg" prepend-icon="mdi-lock-open-variant-outline"
         variant="outlined">
        unblock
      </v-btn>
    <v-btn v-else class="btn  text-none" variant="outlined" rounded="lg"
    @click="blockUser" color="pri" prepend-icon="mdi-account-cancel-outline">
    block
  </v-btn>
    </div>
  </div>
</template>

<style lang="scss">

.interactWrapper{
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
    .btn{
      height: 20px;
    }
  }
}

</style>
