<script setup lang="ts">
import { ref } from 'vue'
import { Match, User } from '@/types/user'
import CustomCard from '@/components/CustomCard.vue';

//just for testing------- will be deleted later-----

const users = ref<User[]>([]);
const testMatches = ref<Match[]>([])
const fill = () => {
    for (let a = 10; a < 20; a++)
{
    const tmpUser:User = {
        id: "" + Math.random(),
        isOnline: true,
        _count: {
            blockedBy: 3,
            friendOf: 2,
            friendWith: 1},
        username: "username" +a.toString(),
        avatar: "sdfa",
        email:"email",
    }
    users.value.push(tmpUser);
}


for (let a = 0; a < 10; a++)
{
    const tmpMatch:Match = {
        matchId: a.toString() ,
        matchHost: users.value[a],
        matchGuest: users.value[(a + 1) % 9],
        matchResult: "0 - 0",
        matchWinner: users.value[a].id,
        matchLoser: users.value[(a + 1) % 9].id,
    }
    testMatches.value.push(tmpMatch)
}
}
fill()
// ------------------------------------------------------------

</script>

<template>
  <CustomCard class="matchesWrapper">

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
            <tr v-for="gam in testMatches">
            <td>{{ gam.matchHost.username }}</td>
            <td class="text-center">{{ gam.matchResult }}</td>
            <td class="text-right">{{ gam.matchGuest.username }}</td>
            </tr>
        </tbody>
        </v-table>
  </CustomCard>
</template>

<style lang="scss">


.matchesWrapper{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 600px;
    overflow: hidden;
    
    .matchesHeader {
        padding-top: 0.5rem;
        color:rgb(var(--v-theme-two));
    }
    .matchesTable {
        width: 100%;
        height: 85%;
        background-color: transparent;
        overflow-y: hidden;
        margin-right: 15px;
    }
    .matchesTable:hover{
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
