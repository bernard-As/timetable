import { Menu, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { RiHome2Line } from "react-icons/ri";
import rootStore from "../../mobx";
import { useNavigate } from "react-router-dom";
import { IoLogIn } from "react-icons/io5";
const LandHeader = observer(({isLogin=false})=>{
    const navigate = useNavigate()
    const menuItems = [
        {
          key: 1,
          icon: React.createElement(isLogin?RiHome2Line:IoLogIn),
          label: isLogin?"Home":'Login',
          onclick:()=>navigate(isLogin?'/home':'/login')
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
                style={{}}
                className="head-menu"
                // inlineCollapsed={false}
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
                  <span>{menuItem.label}</span>
                  {/* {!rootStore.mainStore.sideMenuCollapse&&<span>{menuItem.label}</span>} */}
                </Menu.Item>
              ))}
            </Menu>
        </Header>
    )
})
export default LandHeader;