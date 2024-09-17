import { Layout } from "antd";
import React from 'react';
import { TbMessageChatbot } from "react-icons/tb";
import { IoNotificationsSharp,IoNotificationsOutline,IoNotificationsOffSharp,IoNotificationsOffOutline } from "react-icons/io5";
import { BiMessageRounded,BiSolidMessageRoundedDetail } from "react-icons/bi";
import { RiHome2Line } from "react-icons/ri";
import { Menu } from "antd";
import Cookies from "js-cookie";
import rootStore from "../../mobx";
import { observer } from "mobx-react";

const HeadMenu:React.FC = ()=>{
    const { Header } = Layout;

    const menuItems = [
        {
          key: 1,
          icon: React.createElement(RiHome2Line),
          label: "Home",
          style: rootStore.mainStore.darkMode?{color:'white'}:{color:'black'}
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
                >
                  {!rootStore.mainStore.sideMenuCollapse&&<span>{menuItem.label}</span>}
                </Menu.Item>
              ))}
            </Menu>
        </Header>
    )
}

export default observer( HeadMenu);