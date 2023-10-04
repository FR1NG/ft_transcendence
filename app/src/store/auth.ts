import { defineStore, storeToRefs } from "pinia";
import axios from '../plugins/axios'
import { useUserStore } from './user'
import { AxiosError, AxiosResponse } from "axios";
import router from "@/router";
import { pushNotify } from "@/composables/simpleNotify";
import { meTypes } from "@/types/stateTypes/auth";
import { useSocketStore } from "./socket";
import { bootstrap } from "@/composables/socket";
import { useAppStore } from "./app";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    SIntraUrl: import.meta.env.VITE_INTRA_AUTHORIZATION_URL,
    access_token: "",
    logged: false,
    me: {} as meTypes
  }),
  getters: {
    IntraUrl: (state) => state.SIntraUrl,
  },
  actions: {
    async whoami() {
      if(this.me.id)
        return this.me;
      await this.getMe();
      return this.me;
    },
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
      if (code) {
        try {
          const res = await axios.post('/auth/login', {
            code
          });
          this.setToken(res.data?.access_token);
          if(res.data.virificationRequired)
            router.push({name: 'OtpVirify'})
          else {
            this.logged = true;
            await this.getMe();
            this.redirect();
            this.setOnline(res.data?.access_token);
          }
        } catch (error: any) {
          pushNotify({status:'error', title:'error', text:error.response?.data?.message})
        }
      }
    },
    setOnline(token: string) {
      bootstrap();
      const { socket } = storeToRefs(useSocketStore());
      useSocketStore().setToken(token);
      if(socket.value) {
        socket.value.emit('login');
      }
    },
    setOffline() {
      const { socket } = storeToRefs(useSocketStore());
      if(socket.value)
        socket.value.emit('logout')
    },
    setToken(token: string) {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        this.logged = false;
        localStorage.removeItem('access_token');
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
      this.setToken('') ;
      this.setOffline();
      useAppStore().resetAll();
      this.router.push({name: 'Login'})
    },
    checkAuth() {
      if (this.getToken()) {
        this.logged = true;
        return true;
      }
      return false;
    },
    getToken(): string {
      return localStorage.getItem('access_token') as string;
    },

    async getQr() {
        return new Promise(async (resolve, reject) => {
          try {
          const response: AxiosResponse = await axios.get('/auth/otp/qrcode');
          const { data } = response;
          resolve(data);
        } catch(error: any) {
            pushNotify({status:'error', title:'error', text:error.response.data.message})
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
            pushNotify({status:'error', title:'error', text:error.response.data.message})
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
        } catch (error: any) {
            pushNotify({status:'error', title:'error', text:error.response.data.message})
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
            pushNotify({status:'error', title:'error', text:error.response.data.message})
            reject(error.response);
        }
      })
    },
    reset() {
      this.access_token = "";
      this.logged = false;
      this.me = {} as meTypes;
    }
  }// end of actions

})
