import React from 'react';
import { makeAutoObservable } from 'mobx';
import { PrivateDefaultApi } from '../utils/AxiosInstance';
import MainStore from './MainStore';
import NotificationStore from './NotificationsStore';
import Cookies from 'js-cookie';
import HolisticScheduleStore from './HolisticSchedule';
import HolosticScheduleContentStore from './HolosticScheduleContent';
class RootStore {
  notification = new NotificationStore();
  mainStore = new MainStore();
  holisticScheduleStore = new HolisticScheduleStore();
  holosticScheduleContentStore = new HolosticScheduleContentStore();
  credential = 'OT'
  enableManagement = true;
  constructor() {
    makeAutoObservable(this);
  }

  checkTokenValidity () {
    Cookies.get('token') !==null  ?
    PrivateDefaultApi.post('verify_token').then((res)=>{
        if(res.status === 401){
            window.location.href = process.env.REACT_APP_BASE_URL + 'welcome';
        }else{
          this.credential = res.data.credential
        }
    }).catch((error)=>{
      if(error.status===401)
        window.location.href = process.env.REACT_APP_BASE_URL + 'welcome';
    })
    :window.location.href=  process.env.REACT_APP_BASE_URL + 'login'
  }

  checkTokenValidity2 () {
    Cookies.get('token') !==null  &&
    PrivateDefaultApi.post('verify_token').then((res)=>{
        if(res.status === 401){
            return false;
        }else{
          this.credential = res.data.credential
          return true
        }
    }).catch((error)=>{
      if(error.status===401)
        return false
    })
    return false
  }

  isManager(){
    if(this.credential===('SYSADM'||'PADM')){
      return true
    }
    return false
  }
}

const rootStore = new RootStore();
export default rootStore;
