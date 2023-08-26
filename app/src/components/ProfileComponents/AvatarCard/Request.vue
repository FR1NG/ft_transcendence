<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { reactive, watch } from 'vue'
import { useSnackBarStore } from '@/store/snackbar'
// for test
import axios from '@/plugins/axios'
import { getMaxListeners } from 'process'

const userStore = useUserStore();
const route = useRoute()
const data = reactive({
  sending: false
});

const { user, getRequstStatus, isBlocked } = storeToRefs(userStore);

const username = route.params.username;
if (username) {
  userStore.getUser(username as string)
}
//--------for testing ------ to be deleted later------
const userEmail:String = "username@gmail.com"
//--------------------------------------------------
// notification store

const snackBarStore = useSnackBarStore();
// sending frien request function
const sendFrienRequest = async (userId: string) => {
  try {
    data.sending = true;
    const result = await userStore.sendFriendRequest(userId);
    data.sending = false;
    console.log(result)
  } catch (error) {
    data.sending = false;
    console.log(error)
  }
}

// cancel frien request function
const cancelFriendRequest = async (requestId: string) => {
  try {
    const result = await userStore.cancelFriendRequest(requestId);
    console.log('success')
  } catch (error) {
    console.log('error here')
  }
}

// confirm friend requst
const confirmFriendRequest = async (requestId: string) => {
  try {
    const result = await userStore.confirmFriendRequest(requestId);
    console.log('success')
  } catch (error) {
    console.log('error here')
  }
}

// watching the username change on route parame to refetch data
watch(
  () => route.params.username, async newUsername => {
    console.log(newUsername)
    userStore.getUser(newUsername as string)
  }, {
  immediate: true
}
)

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
</script>

<template>
  <div class="interactWrapper">
    <div class="message">
      <v-btn   class="btn text-none" variant="outlined" rounded="lg" prepend-icon="mdi-message-text-outline">
        message
      </v-btn>
    </div>
    <div class="gameInvite">
      <v-btn class="btn text-none" rounded="lg" variant="outlined" prepend-icon="mdi-gamepad-variant-outline">
        Game invite
      </v-btn>
    </div>
    <div class="request">
      <v-menu open-on-hover :close-on-content-click="false" class="menu">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" class="text-none  ml-1" color="secondary" icon="mdi-dots-vertical" variant="text"></v-btn>
              </template>
      
              <v-list density="compact">
                <v-list-item v-if="getRequstStatus === 'friends'" prepend-icon="mdi-gamepad-variant-outline">
                  <!-- need to add a function to delete friend at click -->
                    unfriend
                </v-list-item>
                
                <v-list-item v-if="isBlocked" @click="unblockUser" color="pri" prepend-icon="mdi-lock-open-variant-outline">
                  <template v-slot:prepend>
                    <v-icon></v-icon>
                  </template>
                  unblock
                </v-list-item>
                <v-list-item @click="blockUser" v-else>
                  <template v-slot:prepend>
                    <v-icon>mdi-account-cancel-outline</v-icon>
                  </template>
                  block
                </v-list-item>
              </v-list>
            </v-menu>
      <div class="addFriend">
        <v-btn v-if="getRequstStatus === 'sent'" class="btn text-none"  rounded="lg" :loading="data.sending"
        @click="cancelFriendRequest(user.friendRequestsRecieved[0].id)" color="secondary" variant="flat">
        cancel request
      </v-btn>
      <v-btn v-else-if="getRequstStatus === 'recieved'" class="btn text-none" rounded="lg" :loading="data.sending"
      @click="confirmFriendRequest(user.friendRequestsSent[0].id)" color="secondary" variant="flat">
      confirm
    </v-btn>
    <v-btn v-else class="btn  text-none" variant="outlined" rounded="lg" prepend-icon="mdi-plus-thick"
    :loading="data.sending" @click="sendFrienRequest(user.id)">
    add friend
  </v-btn>
    </div>
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
  gap: 1rem;
  
  .btn {
    border: 2px solid rgb(var(--v-theme-secondary));
    color: rgb(var(--v-theme-secondary));
    width: 150px;
  }

  .btn:hover {
    color: rgb(var(--v-theme-primary));
    background-color: rgb(var(--v-theme-secondary));
    border: 2px solid rgb(var(--v-theme-secondary));
  }

  .request {
    display: flex;
    height: 40px;
    align-items: center;
    gap: 0;
    .menu {
      background-color:rgb(var(--v-theme-secondary));
    }
  }
}

@media (width < 1110px) {
  .interactWrapper {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: repeat(3, 1fr);
    gap: 0;
    padding-bottom: 0;
    padding-left: 1rem;
    opacity: 0;
    animation: reappear 1.5s linear forwards;
    .message {
      grid-column: 6;
      grid-row: 2;
      transition: grid-column 0.5s;
    }
    .gameInvite {
      grid-column: 6;
      grid-row: 3;
      transition: grid-column 0.5s;
    }
    .request {
      grid-column: 4;
      grid-row: 3;
      transition: grid-column 0.5s;
    }
    .btn {
      width: 125px;
      transition: width 0.5s;
    }
  }
  @keyframes reappear {
    100% {
      opacity: 1;
    }
  }
}
@media (width < 970px) {
  .interactWrapper {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: repeat(3, 1fr);
    gap: 0;
    padding-bottom: 0;
    padding-left: 1rem;
    opacity: 0;
    .message {
      grid-column: 6;
      grid-row: 1;
      transition: grid-column 0.5s;
    }
    .gameInvite {
      grid-column: 6;
      grid-row: 2;
      transition: grid-column 0.5s;
    }
    .request {
      grid-column: 6;
      grid-row: 3;
      transition: grid-column 0.5s;
    }
    .btn {
      width: 180px;
      transition: width 0.5s;
    }
  }
}
@media (width < 640px) {
  .interactWrapper {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: repeat(3, 1fr);
    gap: 0;
    padding-bottom: 0;
    padding-left: 1rem;
    opacity: 0;
    animation: reappear 1.5s linear forwards;
    .message {
      grid-column: 6;
      grid-row: 2;
      transition: grid-column 0.5s;
    }
    .gameInvite {
      grid-column: 6;
      grid-row: 3;
      transition: grid-column 0.5s;
    }
    .request {
      grid-column: 4;
      grid-row: 3;
      transition: grid-column 0.5s;
    }
    .btn {
      width: 125px;
      transition: width 0.5s;
    }
  }
  @keyframes reappear {
    100% {
      opacity: 1;
    }
  }
}

</style>