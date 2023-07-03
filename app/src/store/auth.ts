import { defineStore } from "pinia";
import axios from '../plugins/axios'
import { useUserStore } from './user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    SIntraUrl: import.meta.env.VITE_INTRA_AUTHORIZATION_URL,
    access_token: "",
    logged: false,
  }),
  getters: {
    IntraUrl: (state) => state.SIntraUrl,
  },
  actions: {
    async attemptLogin(code: string) {
      if (!code)
        console.log('FORBIDDEN');
      else {
        try {
          const res = await axios.post('/auth/login', {
            code
          });
          this.setToken(res.data?.access_token);
          this.logged = true;
          this.getProfile();
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
    getProfile() {
      const userStore = useUserStore();
      userStore.getProfile();
    },
    redirect() {
      this.router.push({ name: 'Home' })
    },
    logout() {
      sessionStorage.removeItem('access_token');
      this.profile = {}
      this.logged = false;
      this.router.push({name: 'Login'})
    },
    checkAuth() {
      if (sessionStorage.getItem('access_token')) {
        this.logged = true;
        return true;
      }
      return false;
    }
  }

})
