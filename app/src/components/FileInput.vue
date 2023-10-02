<script setup lang="ts">
import { ref } from 'vue';

  const uploader = ref<HTMLInputElement>();
  const selectedFile = ref(null);
  const loader = ref(false);
  const emit = defineEmits(['update:modelValue', 'select']);
  const props = defineProps(['modelValue', 'isSelected']);


  const handleOnChange = (e:any) => {
  selectedFile.value = e.target.files[0];
    emit('update:modelValue', selectedFile.value)
    emit('select', true);
    loader.value = false;
  }

  const handleImport = () => {
    loader.value = true;
    window.addEventListener('focus', () => {
      loader.value = false;
    }, { once: true });
    uploader.value?.click();
  }
const reset = () => {
  emit('update:modelValue', null);
  emit('select', false);
}
</script>

<template>
  <div>
    <v-btn class="mr-8" v-if="!isSelected" elevation="0"  :loading="loader" variant="outlined" @click="handleImport" icon>
      <v-icon >mdi-plus</v-icon>
    </v-btn>
    <v-btn v-else class="mr-8" elevation="0" :loading="loader" variant="flat" color="colorOne" @click="reset" icon>
      <v-icon >mdi-minus</v-icon>
    </v-btn>
    <input
      class="d-none"
      ref="uploader"
      :value="modelValue"
      type="file"
      @change="handleOnChange"
    >
  </div>
</template>
