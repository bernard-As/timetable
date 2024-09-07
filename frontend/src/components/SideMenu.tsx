import Sider from "antd/es/layout/Sider";
import React from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Menu } from "antd";
const SideMenu:React.FC = ()=>{
    const menuItems = [
      {
        key: 1,
        icon: React.createElement(UserOutlined),
        label: "User",
      },
      {
        key: 2,
        icon: React.createElement(UploadOutlined),
        label: "upload",
      },
    ]
    return (
        <Sider>
            <Menu mode="inline" defaultSelectedKeys={['1']} items={menuItems}/>
        </Sider>
    )
}

export default SideMenu;