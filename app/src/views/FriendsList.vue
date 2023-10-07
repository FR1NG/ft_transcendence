<script setup lang="ts">
    import { useFriendsStore } from '@/store/friends'
import { useSocketStore } from '@/store/socket';
    import { storeToRefs } from 'pinia'
import { ref } from 'vue';

    const friendsStore = useFriendsStore();
    const { friends } = storeToRefs(friendsStore);
    const loader = ref(true);


    friendsStore.getFriends().then(() => {
      loader.value = false;
    }).catch(() => {
        loader.value = false;
      });
  useSocketStore().subscribHotReloadEvent({scope: 'user', cb: friendsStore.getFriends});

    const couleur = ref("");
const getColor = (isInGame: boolean, isOnline: boolean) => {
  if(isInGame)
  {
    couleur.value = 'blue';
    return 'blue';
  }
  if(isOnline)
  {
    couleur.value = 'green'
    return 'green';
  }
  couleur.value = 'gray';
  return 'gray'
}
</script>

<template>
    <div class="listWrapper">
    <v-table class="matchesTable" :loading="loader" theme="dark">
      <thead>
        <tr>
          <th class="text-left">
            Friend
          </th>
          <th class="text-center abc">
            Status
          </th>
          <th class="text-right">
            Profile
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="friend in friends" :key="friend.id">
          <td>
            <v-list-item>
              <img class="avatar" :src="friend.avatar" alt="">
              <div class="username">{{ friend.username }}</div>
              </v-list-item>
          </td>
          <td class="abc text-center">
            <v-list-item :class="`text-${getColor(friend.isInGame, friend.isOnline)}`">{{ friend.status }}</v-list-item>
          </td>
          <td class="text-right">
            <v-btn :to="{name: 'UserProfile', params: {username: friend.username}}">view</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    </div>
</template>

<style lang="scss">

.listWrapper {
    background-color: rgb(var(--v-theme-colorOne));
    height: 100%;
    width: 100%;
    padding: 2rem;
}

.v-list-item__content  {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 5px;
  }
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

@media(width < 450px){
  .abc{
    display: none;
  }
  .v-list-item__content  {
    .avatar {
      border: 3px solid v-bind(couleur);
    }
  }
}

</style>
