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
          colorOne: '#000000',
          colorTwo: '#DB022B',
          colorThree: '#5c0606',
          colorFoure: '#FAF0E6',
          sucess: '#0080000',
          test: '#6A1B9A',
        },
      },
    },
  },
})
