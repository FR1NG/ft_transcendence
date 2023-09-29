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
          colorOne: '#352F44',
          colorTwo: '#FAF0E6',
          colorThree: '#B9B4C7',
          colorFoure: '#5C5470',
          sucess: '#008000',
          test: '#6A1B9A',
        },
      },
      dark: {
        colors: {
          colorOne: '#141E46',
          colorTwo: '#FFF5E0',
          colorThree: '#FF6969',
          colorFoure: '#C70039',
          sucess: '#008000',
          test: '#6A1B9A',
        },
      },
      girly: {
        colors: {
          colorOne: '#B0578D',
          colorTwo: '#D988B9',
          colorThree: '#FACBEA',
          colorFoure: '#FFE4D6',
          sucess: '#008000',
          test: '#6A1B9A',
        },
      },

    },
  },
})
