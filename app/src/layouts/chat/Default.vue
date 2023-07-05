
<script lang="ts" setup>
 import AppBar from '../default/AppBar.vue';
 import { ref } from 'vue';
 import { io } from 'socket.io-client';
 import axios from '@/plugins/axios'

 const message = ref('');
 const socket = io('https://game.hchakoub.codes', {
   query: {
     token: sessionStorage.getItem('access_token'),
   }
 });
 console.log('trying to connect to socket server')
  socket.emit('connection', 'hello server');
  socket.on('connected', function() {
    console.log('socket connected');
   socket.emit('message', 'hi server how are you')
 })
 const send = () => {
   if(message.value.length > 0)
    socket.emit('message', message.value)
   else
    console.log('cant sent empty string');
 }

 socket.on('message', (message) => {
   console.log(message)
 })

 // for test

  const users: any = ref([]);

 const fetch = async () => {
   try {
   const response: any = await axios.get('/user');
     console.log(response.data)
     users.value = response.data;
   } catch(error) {
     console.log(error)
   }
 }
 fetch();
</script>

 <template>
  <v-app id="inspire">
     <app-bar></app-bar>
    <v-navigation-drawer
      color="grey-lighten-3"
      rail
    >
      <v-avatar
        class="d-block text-center mx-auto mt-4"
        color="grey-darken-1"
        size="36"
      ></v-avatar>

      <v-divider class="mx-3 my-5"></v-divider>

      <v-avatar
        v-for="user in users"
        :key="user.id"
        class="d-block text-center mx-auto mb-9"
        color="grey-lighten-1"
        size="28"
      >
        <v-img :src="user.avatar">

        </v-img>
      </v-avatar>
    </v-navigation-drawer>

    <v-navigation-drawer
      width="244"
    >
      <v-sheet
        color="grey-lighten-5"
        height="128"
        width="100%"
      ></v-sheet>

      <v-list>
        <v-list-item
          v-for="n in 5"
          :key="n"
          :title="`Item ${ n }`"
          link
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      class="px-3"
      color="grey-lighten-4"
      flat
      height="72"
    >
      <v-spacer></v-spacer>

      <v-responsive max-width="156">
        <v-text-field
          bg-color="grey-lighten-2"
          class="rounded-pill overflow-hidden"
          density="compact"
          hide-details
          variant="solo"
        ></v-text-field>
      </v-responsive>
    </v-app-bar>

    <v-main><!--  -->

    </v-main>

    <v-navigation-drawer location="right">
      <v-list>
        <v-list-item
          v-for="n in 5"
          :key="n"
          :title="`Item ${ n }`"
          link
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-footer
      app
      height="72"
    >
      <v-text-field
        bg-color="grey-lighten-1"
        class="rounded-pill overflow-hidden"
        density="compact"
        hide-details
        variant="solo"
        v-model="message"
      ></v-text-field>
      <v-btn color="primary" variant="outlined" @click="send">send</v-btn>
    </v-footer>
  </v-app>

</template>

