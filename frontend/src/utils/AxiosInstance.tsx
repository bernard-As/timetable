import axios from 'axios';
import Cookies from 'js-cookie';
import rootStore from '../mobx';

// Utility function to get the token
const getToken = () => Cookies.get('token');
export const PublicMainApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const PublicDefaultApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL + 'api' || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});


// Default API (Authenticated)
export const PrivateDefaultApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL + 'api' || 'http://localhost:8000/api/',
  headers: {
    'Authorization': `Token ${getToken()}`,
    'Content-Type': 'application/json'
  }
});

export const PrivateApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL + 'mainapi' || 'http://localhost:8000/mainapi/',
  headers: {
    'Authorization': `Token ${getToken()}`,
    'Content-Type': 'application/json'
    }
})

// Axios response interceptor for DefaultApi
PrivateDefaultApi.interceptors.response.use(
  response => response,
  error => {
    if (error&&error.response && error.response.status === 401) {
      rootStore.notification.notify({
        type:'error',
        text: 'Please login to access fine-tuned informations.',
        title:'Please login to access fine-tuned informations.',
        timeout:1500
      })
    }else if(error&&error.response && error.response.status === 500){
      rootStore.notification.notify({
        type:'error',
        text: 'An Unexpected error occur. Please try later',
        title:'Unexpected',
        timeout:1500
      })
    }else if(error&&error.response && error.response.status === 400){
      rootStore.notification.notify({
        type:'error',
        text: `Error=> ${Object.keys(error.response.data).map(key => `${key}: ${error.response.data[key]}`).join('\n')}`,
        title:'Unexpected',
        timeout:1500
      })
    }
    return Promise.reject(error);
  }
);

PrivateApi.interceptors.response.use(
  response => response,
  error => {
    if (error&&error.response && error.response.status === 401) {
      rootStore.notification.notify({
        type:'error',
        text: 'Please login to access fine-tuned informations.',
        title:'Please login to access fine-tuned informations.',
        timeout:1500
      })
    }else if(error&&error.response && error.response.status === 500){
      rootStore.notification.notify({
        type:'error',
        text: 'An Unexpected error occur. Please try later',
        title:'Unexpected',
        timeout:1500
      })
    }else if(error&&error.response && error.response.status === 404){
      rootStore.notification.notify({
        type:'error',
        text: 'An Unexpected error occur. Please try later',
        title:'Unexpected',
        timeout:1500
      })
    }
    return Promise.reject(error);
  }
);

export const PrivateMainApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/',
  headers: {
    'Authorization': `Token ${getToken()}`,
    'Content-Type': 'application/json'
  }
});

// Axios response interceptor for DefaultApi
PrivateMainApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
