<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { reactive, watch } from 'vue'

const userStore = useUserStore();
const route = useRoute()
const data = reactive({
  sending: false
});

const { user, getRequstStatus } = storeToRefs(userStore);

const username = route.params.username;
if (username) {
  userStore.getUser(username as string)
}

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
</script>

<template>
  <v-card flat min-height='800' class="ma-4">

    <v-row no-gutters>
      <v-col cols="12" md="4">
        <v-card class='ma-2 pb-8' rounded='xl' min-height="800">
          <!-- user profile here -->
          <v-img cover height="200" src='https://cdn.intra.42.fr/coalition/cover/78/Freax_BG.jpg'>
            <v-avatar class="ma-4" size='180'>
              <v-img cover :src="user.avatar"></v-img>
            </v-avatar>
          </v-img>
          <v-card class="ma-1" color="#D4D5D8" rounded="lg" variant="flat">
            <v-card-item>

              <v-card-title class="text-body-2 d-flex align-center">
                <v-span> {{ user.username }} </v-span>
                <v-badge dot :color="user.isOnline ? `success` : `secondary`" class="ml-4 mb-2"></v-badge>
                <v-spacer></v-spacer>
                <v-chip class="ms-2 text-medium-emphasis" color="white" prepend-icon="mdi-account-multiple" size="small"
                  :text="userStore.friendsCount.toString()" variant="flat"></v-chip>

              </v-card-title>
              <v-card-subtitle>{{ user.email }}</v-card-subtitle>
            </v-card-item>
            <div class="pa-4 d-flex align-center">

              <v-btn v-if="getRequstStatus === 'friends'" class="me-2 text-none" color="info" variant="outlined">
                unfriend
              </v-btn>

              <v-btn v-else-if="getRequstStatus === 'sent'" class="me-2 text-none" :loading="data.sending"
                @click="cancelFriendRequest(user.friendRequestsRecieved[0].id)" color="primary" variant="flat">
                cancel request
              </v-btn>

              <v-btn v-else-if="getRequstStatus === 'recieved'" class="me-2 text-none" :loading="data.sending"
                @click="confirmFriendRequest(user.friendRequestsSent[0].id)" color="primary" variant="flat">
                confirm
              </v-btn>

              <v-btn v-else class="me-2 text-none" :loading="data.sending" @click="sendFrienRequest(user.id)"
                color="primary"  variant="flat">
                add friend
              </v-btn>

              <v-btn v-if="user.id" :to="{ name: 'Dm', params: { id: user.id } }" class="text-none" variant="outlined">
                message
              </v-btn>
              <!-- options [start] -->
                  <v-menu open-on-hover :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" class="text-none  ml-2" icon="mdi-dots-horizontal" variant="text"></v-btn>
                    </template>
                  <v-list density="compact">
                    <v-list-item>
                      <v-btn>
                        <template v-slot:prepend>
                          <v-icon>mdi-gamepad-variant-outline</v-icon>
                        </template>
                        invite
                    </v-btn>
                    </v-list-item>

                    <v-list-item>
                      <v-btn>
                        <template v-slot:prepend>
                          <v-icon>mdi-cancel</v-icon>
                        </template>
                        block
                    </v-btn>
                    </v-list-item>
                  </v-list>
                  </v-menu>
              <!-- options [end] -->
            </div>
          </v-card>
          <!-- end profile -->
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-row no-gutters>
          <v-col clos="12">

            <v-card class='ma-2 pa-2' rounded='xl' min-height="392">
              here
            </v-card>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <v-card class='ma-2 pa-2' rounded='xl' min-height="392">
              here
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card min-height="300" rounded="xl" class="pa-2 ma-2">
  here
      </v-card>
    </v-col>
  </v-row>
</v-card></template>
