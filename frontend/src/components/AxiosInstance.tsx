import Alert from './alerts/normalAlert';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import TokenChecker from '../tokenChecker';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/'
})
api.defaults.headers.common['Authorization'] = `Token ${Cookies.get('token')}`;
api.defaults.headers.common['Content-Type'] = 'application/json';

api.interceptors.request.use(
  config => {
     return config;
  },
  error => {
    const navigate = useNavigate()
    //Handle errors here
    return Promise.reject(error);
  }
 );

export default api;
