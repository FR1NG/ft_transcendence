<script lang="ts" setup>
import { computed } from 'vue';


const props = defineProps(['modelValue', 'disabled'])
const emit = defineEmits(['update:modelValue', 'send', 'focus'])

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
})

const handleSend = () => {
  emit('send');
}

const handleFocus = (value: boolean) => {
  if(value)
    emit('focus');
}
</script>

<template>
    <v-footer color="colorOne" app height="72">
      <v-text-field :disabled="disabled" bg-color="colorThree" class="overflow-hidden"
        density="compact" hide-details variant="solo" v-model="value"
         @keyup.enter="handleSend"
          @update:focused="handleFocus"
    >
        <template v-slot:append-inner>
          <v-icon @click="handleSend" color="colorTwo">
            mdi-send-circle-outline
          </v-icon>
         </template>
      </v-text-field>
    </v-footer>
</template>
