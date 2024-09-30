import { Card, List, Tag } from "antd";
import { useEffect, useState } from "react";
import { MdOpenInNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
const SysNotificationsPreView = () =>{
    const navigate = useNavigate()
    const [data,setData] = useState([])

    useEffect(()=>{
        const getSystemNew = ()=>{
            PrivateDefaultApi.get('system_news/').then((res)=>{
                setData(res.data);
            }).catch(error=>{
                console.log(error);
            })
        }
        getSystemNew()
    },[navigate])

    return (
        <Card
            title={<span>System Notification</span>}
            // extra={<div><MdOpenInNew size={25}/></div>}
            className="new-preview"
        >
            <List
                itemLayout="horizontal"
                dataSource={data}
                style={{
                    overflowY:'scroll',
                    maxHeight: '320px',
                }}
                renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.title}
                        description={item.content}
                        action={[<Tag color="grey">{item.created_at}</Tag>]}
                      />
                    </List.Item>
                  )}
            />
        </Card>
    )
}

export default  SysNotificationsPreView;