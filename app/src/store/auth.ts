import { defineStore } from "pinia";
import axios from '../plugins/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    SIntraUrl: import.meta.env.VITE_INTRA_AUTHORIZATION_URL,
    access_token: "",
    logged: false,
  }),
  getters: {
    IntraUrl: (state) => state.SIntraUrl,
    getLogged: () => {
        if (sessionStorage.getItem('access_token'))
          return true;
        return false
      },
  },
  actions: {
    async attemptLogin(code: string) {
      if (!code)
        console.log('FORBIDDEN');
      else {
        try {
          const res = await axios.post('/auth/login', {
            code
          })
          console.log(res);
          this.setToken(res.data?.access_token);
          this.redirect();
        } catch (error) {
          console.error(error)
        }
      }
    },
    setToken(token: string) {
      if (token) {
        sessionStorage.setItem('access_token', token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        this.loading = true;
      } else {
        this.logged = false;
        sessionStorage.removeItem('access_token');
      }
    },
    redirect() {
      this.router.push({ name: 'Test' })
    }
  }

})
