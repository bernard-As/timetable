import React from 'react';
import { makeAutoObservable } from 'mobx';
class NotificationStore {

  constructor() {
    this.nId = 0;
    this.notifications = [];
    makeAutoObservable(this);
  }

  addNotification(notification) {
    this.notifications.push(notification);
  }

  removeNotification(notificationId) {
    this.notifications = this.notifications.filter(
      (notification) => notification.id !== notificationId
    );
  }

  removeAllNotifications() {
    this.notifications = [];
  }

  notify({type='info',text,title,timeout}){
    if (!timeout)
      {
        switch (type)
        {
          case 'info':
            timeout = 3000;
            break;
          case 'error':
            timeout = 5000;
            break;
          default:
            break;
        }
      }
      const notification =
	    {
	    	id : (this.nId+1).toString,
	    	type,
	    	title,
	    	text,
	    	timeout
	    };
        this.addNotification(notification);
        setTimeout(()=>{
          this.removeNotification(notification.id);
        }, timeout)
  }
}

export default NotificationStore;
