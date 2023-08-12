import axios from 'axios'
import router from '../router';

const Trexios = axios.create({
  baseURL:  import.meta.env.VITE_API_URL
})


// redirect if Unauthenticated
Trexios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401 || error.response.status === 419) {
      if(sessionStorage.getItem('access_token')){
        sessionStorage.removeItem('access_token');
        window.location.reload();
      }
    } else {
        const newLocation = error.response.statusText.toLowerCase().split(' ').join('_');
      console.log(router);
        router.push(`/${newLocation}`)
        // window.location.replace(`/${newLocation}`);
      }

    return Promise.reject(error);
});

// inject Authorization header in every request
Trexios.interceptors.request.use(function(config) {
  const token = sessionStorage.getItem('access_token');
  if (token)
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default Trexios;
