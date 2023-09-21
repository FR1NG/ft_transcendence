<script setup lang="ts">
import CustomCard from '@/components/CustomCard.vue';
import { User } from '@/types/user';

defineProps<{user: User, loading: Boolean}>()
</script>

<template>
  <CustomCard class="matchesWrapper" :loading="loading">
    <h2 class="matchesHeader">Last matches</h2>
    <v-table class="matchesTable" theme="dark">
      <thead>
        <tr>
          <th class="text-left">
            host
          </th>
          <th class="text-center">
            result
          </th>
          <th class="text-right">
            guest
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in user.games" :key="game.id">
          <td>
            <v-list-item :to="{name: 'UserProfile', params: {username: game.host.username}}" :active="false" :prepend-avatar="game.host.avatar">
              {{ game.host.username }}
            </v-list-item>
          </td>

          <td class="text-center">{{ game.winnerId === game.host.id ? `${game.winnerScore} - ${game.loserScore}` : `${game.loserScore} - ${game.winnerScore}`}}</td>
          <td>
            <v-list-item :to="{name: 'UserProfile', params: {username: game.guest.username}}" :active="false" :prepend-avatar="game.guest.avatar">
              {{ game.guest.username }}
            </v-list-item>
          </td>
        </tr>
      </tbody>
    </v-table>
  </CustomCard>
</template>

<style lang="scss">
.matchesWrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 600px;
  overflow: hidden;

  .matchesHeader {
    padding-top: 0.5rem;
    color: rgb(var(--v-theme-two));
  }

  .matchesTable {
    width: 100%;
    height: 85%;
    background-color: transparent;
    overflow-y: hidden;
    margin-right: 15px;
  }

  .matchesTable:hover {
    overflow-y: scroll;
  }

  .matchesTable::-webkit-scrollbar {
    display: block;
  }

  .matchesTable::-webkit-scrollbar {
    width: 4px;
  }

  .matchesTable::-webkit-scrollbar-track {
    background-color: rgba(250, 0, 0, 0.2);
    border-radius: 25px;
  }

  .matchesTable::-webkit-scrollbar-thumb {
    background-color: red;
    width: 20px;
    border-radius: 25px;
  }
}
</style>


<!-- <script setup lang="ts">
import { User } from '@/types/user'
import CustomCard from '@/components/CustomCard.vue';

//just for testing------- will be deleted later-----


const props = defineProps<{
  user: User
}>();
// ------------------------------------------------------------

</script>

<template>
  <CustomCard class="matchesWrapper">

      <h2 class="matchesHeader">Last matches</h2>
        <v-table class="matchesTable" theme="dark">
        <thead>
            <tr>
            <th class="text-left">
                Opponent
            </th>
            <th class="text-center">
                result
            </th>
            <th class="text-right">

            </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="gam in props.user.games">
            <td>{{ gam.game.host.username }}</td>
            <td class="text-center">{{ gam.score }} - {{ gam.opponentScore }}</td>
            <td class="text-right win" v-if="gam.score > gam.opponentScore"> win </td>
            <td class="text-right loss" v-else> loss </td>
            </tr>
        </tbody>
        </v-table>
  </CustomCard>
</template> -->
