/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          background: '#352F44',
          surface: '#352F44',
          primary: '#1867C0',
          secondary: '#E0E0E0',
          colorOne: '#352F44',
          colorTwo: '#5C5470',
          colorThree: '#B9B4C7',
          colorFoure: '#FAF0E6',
          test: '#6A1B9A',
        },
      },
    },
  },
})
