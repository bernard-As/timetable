import { Card, List, Space, Tag } from "antd";
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
            title={<span>Notifications</span>}
            // extra={<div><MdOpenInNew size={25}/></div>}
            className="new-preview"
        >
            <Space
                style={{
                    margin:'7px'
                }}
            >
                <button
                    style={{width:'15px',height:'15px',
                        backgroundColor:'#B2B000'
                    }}
                />
                <span>System Notification</span>
                <button
                    style={{width:'15px',height:'15px',
                        backgroundColor:'#01F500'
                    }}
                />
                <span>Lecture Notification</span>
            </Space>
            <List
                itemLayout="horizontal"
                dataSource={data}
                style={{
                    overflowY:'scroll',
                    maxHeight: '320px',
                }}
                renderItem={(item, index) => (
                    <List.Item
                    style={{
                        backgroundColor:item.type==='lect'?'#01F500':'#B2B000',
                        padding:'10px',
                        margin:'5px',
                        borderRadius:'7px'
                    
                    }}
                    >
                      <List.Item.Meta
                        title={item.title}
                        description={<span>{item.content} <span>Published at {item.created_at}</span> </span>}
                      />
                    </List.Item>
                  )}
            />
        </Card>
    )
}

export default  SysNotificationsPreView;