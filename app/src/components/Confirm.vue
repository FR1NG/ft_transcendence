<script setup lang="ts">
import { computed, ref } from 'vue';


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm',
  },
  text: {
    type: String,
    default: 'are you sure about this action ?',
  },
  width: {
    type: String,
    default: "500"
  },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'confirmAsync']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
})

const loading = ref(false);

// events

const callback = () => {
  loading.value = false;
  value.value = false;
}

const error = () => {
  loading.value = false;
  console.log('error on confirmation component');
}

const confirm = () => {
  loading.value = true;
  emit('confirm', callback, error);

}

</script>

<template>

  <v-dialog v-model="value" :width="width">
    <v-card :loading="loading">
      <v-card-title>
        {{title}}
      </v-card-title>
      <v-card-text>
        {{ text }}
      </v-card-text>
      <v-card-actions>
        <v-btn @click="value = false">close</v-btn>
        <v-btn @click="confirm" :disabled="loading">confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
