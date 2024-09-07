import { observer } from 'mobx-react';
import { Button, Divider, notification, Space } from 'antd';
import { useEffect } from 'react';
import rootStore from '../mobx';
const Notifications = observer(() =>{
    const [notificationApi, contextHolder] = notification.useNotification();
    console.info('rerending Notification');
    
    return (
        
        <div id="notifications">
            {contextHolder}
           {
            rootStore.notification.notifications.map((notification:any) =>{
                setTimeout(() => {
                    notificationApi.info({
                        key : notification.id,
                        message: notification.title,
                        description: notification.text,
                        placement: 'topRight'
                      });
                }, 250);
                return <></>
            })
           }
        </div>
    )
});
export default Notifications;