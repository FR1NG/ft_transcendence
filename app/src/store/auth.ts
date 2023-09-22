import { defineStore } from "pinia";
import axios from '../plugins/axios'
import { useUserStore } from './user'
import { AxiosError, AxiosResponse } from "axios";
import router from "@/router";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    SIntraUrl: import.meta.env.VITE_INTRA_AUTHORIZATION_URL,
    access_token: "",
    logged: false,
    me: {} as any
  }),
  getters: {
    IntraUrl: (state) => state.SIntraUrl,
  },
  actions: {
    async getMe() {
      return new Promise(async (resolve, reject) => {
      try {
        const response: AxiosResponse = await axios.get('/auth/me');
        const { data } = response;
        this.me = data;
        this.logged = true;
        resolve(data);
      } catch (error: AxiosError | any) {
          reject(error.response);
        }
      })
    },
    async attemptLogin(code: string) {
      if (!code)
        console.log('FORBIDDEN');
      else {
        try {
          const res = await axios.post('/auth/login', {
            code
          });
          this.setToken(res.data?.access_token);
          if(res.data.virificationRequired)
            router.push({name: 'OtpVirify'})
          else {
            this.logged = true;
            this.getMe();
            this.redirect();
          }
        } catch (error) {
          console.error(error)
        }
      }
    },
    setToken(token: string) {
      if (token) {
        sessionStorage.setItem('access_token', token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
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
    },
    async getQr() {
        return new Promise(async (resolve, reject) => {
          try {
          const response: AxiosResponse = await axios.get('/auth/otp/qrcode');
          const { data } = response;
          resolve(data);
        } catch(error: any) {
            reject(error.response);
        }
      })
    },
    // enable otp
    async enableTwoFactor(code: string) {
      return new Promise(async (resolve, reject) => {
          try {
          const response: AxiosResponse = await axios.post('/auth/otp/enable', {
            code
          });
          resolve(response.data);
        } catch (error: any) {
            reject(error.response)
        }
      })
    },

    //disable otp
    async disableTwoFactor(code: string) {
      return new Promise(async (resolve, reject) => {
          try {
          const response: AxiosResponse = await axios.post('/auth/otp/disable', {
            code
          });
          resolve(response.data);
          console.log(response.data)
        } catch (error: any) {
            reject(error.response)
        }
      })
    },

    // otp virification
    async otpVirify(code: string) {
      return new Promise(async (resolve, reject) => {
        try {
          const response: AxiosResponse = await axios.post('/auth/otp/virify', {
             code
          });
          const { data } = response;
          this.setToken(data.access_token)
          resolve(data);
          this.redirect();
          this.getMe();
        } catch(error: any) {
          reject(error.response);
        }
      })
    }
  }// end of actions

})
