<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const userStore = useUserStore();
const { user } = storeToRefs(userStore);


// temp variable to test----------------- going to be deleted later---------//
const userLevel = ref(2500);
const userLevel2 = ref((userLevel.value * 100 / 5000).toString() + '%')
//-------------------------------------------------------------------------//

// const userLevel = ref(user.points);
const userLevel1 = ref(0);
const leagues = [
  10,
  50,
  100,
  500,
  1800,
  5000,
  10000,
]
// const userLevel2 = ref((userLevel.value * 100 / leagues[user.league]).toString() + '%')


</script>

<template>
  <div class="levelBarWrapper">
    <div class="league">{{ userLevel }} / 5000</div>
    <!-- <div class="league">{{ userLevel }} / {{ leagues[user.league] }}</div> -->
    <div class="levelBar">
      <div class="innerBar"></div>
    </div>
  </div>
</template>

<style lang="scss">

$levl: v-bind(userLevel) + '%';

.levelBarWrapper {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  bottom: 10%;
}


.levelBar {
  width: 90%;
  height: 2vh;
  box-shadow: 1px 1px 1px 1px #271b1b,
              -1px -0.5px 2px 1px rgba(181, 160, 160, 0.7);
  border-radius: 50px;
  align-items: center;
  .innerBar {
    height: 15px;
    width: 0;
    background: linear-gradient(to right, rgb(var(--v-theme-colorThree)), rgb(var(--v-theme-colorTwo)));
    border-radius: 50px;
    margin: 2px 0;
    animation: levelAnimat 1s linear forwards
  }
  @keyframes levelAnimat {
    100% {
      width: v-bind(userLevel2);
      animation-timing-function: ease-out;
    }
  }

}
.league {
  color: rgb(var(--v-theme-colorTwo));
}

</style>


<!-- <script setup lang="ts">
import { ref } from 'vue'
import { Level } from '@/types/user';
import { LVAL_TYPES } from '@babel/types';


const props = defineProps<{
  lvl: Level
}>();

const userLevel = ref(props.lvl.points);
const userLevel2 = ref((userLevel.value * 100 / props.lvl.leag.maxPoints).toString() + '%')


</script>

<template>
  <div class="levelBarWrapper">
    <div class="league">{{ props.lvl.points }} / {{ props.lvl.leag.maxPoints }}</div>
    <div class="levelBar">
      <div class="innerBar"></div>
    </div>
  </div>
</template> -->
