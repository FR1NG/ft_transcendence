<script setup lang="ts">
import { ref } from 'vue';
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';
import { useTheme } from 'vuetify/lib/framework.mjs';
import { watch } from 'vue'

const radios = [
    {value: 'light', color: 'white', label: 'Light'},
    {value: 'dark', color: 'black', label: 'Dark'},
    {value: 'girly', color: 'pink', label: 'Glamour'},
]
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore)

const vTheme = useTheme();
const localTheme = ref<string>(localStorage.getItem('theme') as string)

watch(() => localTheme.value, (newValue) => {
        vTheme.global.name.value = localTheme.value;
        window.localStorage.setItem('theme', localTheme.value);
})

</script>

<template>
    <v-card color="transparent" elevation="0">
        <v-radio-group v-model="localTheme" inline>
            <v-radio v-for="radio in radios"
            :key="radio.value"
            :class="`pl-10 text-${radio.color}`"
            :value="radio.value"
            :color="radio.color"
            :label="radio.label"
                 ></v-radio>
        </v-radio-group>
    </v-card>
</template>

