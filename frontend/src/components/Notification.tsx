import { observer } from 'mobx-react';
import { Button, Divider, message, Space } from 'antd';
import { useEffect } from 'react';
import rootStore from '../mobx';
const Notifications = observer(() =>{
    const [notificationApi, contextHolder] = message.useMessage();
    console.info('rerending Notification');
    
    return (
        
        <div id="notifications">
            {contextHolder}
           {
            rootStore.notification.notifications.map((notification:any) =>{
                let cnt = 'error';
                if(notification.text !== ''){
                    cnt = notification.text;
                }else
                {
                    cnt = notification.title;
                }
                setTimeout(() => {
                    notificationApi.info({
                        key : notification.id,
                        content: cnt,
                      });
                }, 250);
                return <></>
            })
           }
        </div>
    )
});
export default Notifications;