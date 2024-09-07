import React, { useEffect, useState } from 'react';
import rootStore from '../mobx';
import { Layout } from 'antd';
import SideMenu from './SideMenu';
const Home: React.FC = () =>{
    useEffect(()=>{
        rootStore.checkTokenValidity();
    },[])
    return (
        <>
            <Layout className=''>
                <SideMenu/>
            </Layout>
        </>
    );
}
export default  Home;