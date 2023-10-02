import { useAuthStore } from '@/store/auth';
import axios from 'axios'
import { useRouter } from 'vue-router';

const Trexios = axios.create({
  baseURL:  import.meta.env.VITE_API_URL
})


// redirect if Unauthenticated
Trexios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
      if(useAuthStore().getToken()){
        useAuthStore().logout();
      }
    }
    return Promise.reject(error);
});

// inject Authorization header in every request
Trexios.interceptors.request.use(function(config) {
  const token = useAuthStore().getToken();
  if (token)
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default Trexios;
