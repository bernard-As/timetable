import React from 'react';
import { makeAutoObservable } from 'mobx';
import { PrivateDefaultApi } from '../utils/AxiosInstance';
import MainStore from './MainStore';
import NotificationStore from './NotificationsStore';
import Cookies from 'js-cookie';
class RootStore {
  notification = new NotificationStore();
  mainStore = new MainStore();
  constructor() {
    makeAutoObservable(this);
  }

  checkTokenValidity () {
    Cookies.get('token') !==null  ?
    PrivateDefaultApi.post('verify_token').then((res)=>{
        if(res.status === 401){
            window.location.href = process.env.REACT_APP_BASE_URL + 'welcome';
        }
    }).catch((error)=>{
      if(error.response.status===401)
        window.location.href = process.env.REACT_APP_BASE_URL + 'welcome';
    })
    :window.location.href=  process.env.REACT_APP_BASE_URL + 'login'
}  
}

const rootStore = new RootStore();
export default rootStore;
