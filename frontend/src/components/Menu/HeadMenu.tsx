import { Layout } from "antd";
import React, { useEffect, useState } from 'react';
import { TbMessageChatbot } from "react-icons/tb";
import { IoNotificationsSharp,IoNotificationsOutline,IoNotificationsOffSharp,IoNotificationsOffOutline } from "react-icons/io5";
import { BiMessageRounded,BiSolidMessageRoundedDetail } from "react-icons/bi";
import { RiHome2Line } from "react-icons/ri";
import { Menu } from "antd";
import Cookies from "js-cookie";
import rootStore from "../../mobx";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { IoLogIn } from "react-icons/io5";
import { SiWelcometothejungle } from "react-icons/si";
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
const HeadMenu:React.FC = observer(()=>{
    const { Header } = Layout;
    const navigate = useNavigate()
    const [isLogin,setisLogin]:any = useState(false)
    useEffect(()=>{
      const checkTokenValidity2 = async()=> {
        Cookies.get('token') !==null  &&
        await PrivateDefaultApi.post('verify_token').then((res)=>{
            if(res.status === 401){
                setisLogin(false)
                navigate('/welcome')
            }else{
              rootStore.credential = res.data.credential
              setisLogin(true)
            }
        }).catch((error)=>{
          if(error.status===401)
                navigate('/welcome')
        })
      }
      checkTokenValidity2()
    },[navigate])

    const menuItems = [
        {
          key: 1,
          icon: React.createElement(isLogin?RiHome2Line:IoLogIn),
          label: isLogin?"Home":'Login',
          style: rootStore.mainStore.darkMode?{color:'white'}:{color:'black'},
          onclick:()=>navigate(isLogin?'/home':'/login')
        },
        {
          key: 2,
          icon: React.createElement(SiWelcometothejungle),
          label: "Welcome",
          style: rootStore.mainStore.darkMode?{color:'white'}:{color:'black'},
          onclick : ()=>{
            navigate('/welcome')
          }
        },
        // {
        //   key: 2,
        //   icon: React.createElement(IoNotificationsOutline),
        //   label: "Notification",
        //   style: rootStore.mainStore.darkMode?{color:'white'}:{color:'black'}
        // },
        // {
        //   key: 3,
        //   icon: React.createElement(BiMessageRounded),
        //   label: "Message",
        //   style: rootStore.mainStore.darkMode?{color:'white'}:{color:'black'}
        // },
        // {
        //   key: 4,
        //   icon: React.createElement(TbMessageChatbot),
        //   label: "Ai Chatbot",
        //   style: rootStore.mainStore.darkMode?{color:'white'}:{color:'black'}
        // },
      ];
    
    return (
        <Header
            style={{display:'flex'}}
            className="head-menu-container"
        >
            <div
                className='logo'
            >
                <img src="./rdu_logo.png" alt="Rauf Denktaş Üniversite" />
            </div>
            <Menu
                mode="horizontal"
                style={{flex:1,minWidth:0}}
                className="head-menu"
            >
              {menuItems.map((menuItem) => (
                <Menu.Item
                key={menuItem.key}
                icon={<span style={{fontSize:20}}>
                        {menuItem.icon}
                      </span> }
                style={menuItem.style}
                onClick={()=>menuItem.onclick()}
                
                >
                  {!rootStore.mainStore.sideMenuCollapse&&<span>{menuItem.label}</span>}
                </Menu.Item>
              ))}
            </Menu>
        </Header>
    )
})

export default HeadMenu;