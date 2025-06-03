import React, { useEffect, useState } from 'react';
import rootStore from '../mobx';
import { Layout } from 'antd';
import SideMenu from './Menu/SideMenu';
import HeadMenu from './Menu/HeadMenu';
import DynamicBreadcrumbs from './Menu/Breadcrumb';
import DynamicContent from './Content';
import DynamicFooter from './Footer';
import SystemAnalisys from './sysAnalysis';
import AssessmentModal from './AssessmentModal';
import { CookiesProvider } from 'react-cookie';
const { Header, Content, Sider } = Layout;
const Home: React.FC = () =>{
    useEffect(()=>{
        rootStore.checkTokenValidity();
    },[])
    return (
        <>
            <Layout className='main-layout' >
                <HeadMenu/>
                <Layout>
                    <SideMenu/>
                    <Layout
                        style={{
                            padding:rootStore.holisticScheduleStore.isPhone()?'0 4px 0px':'0 15px 15px',
                            backgroundColor:rootStore.mainStore.darkMode?'rgb(31, 36, 56)':'rgb(176, 192, 255)'
                        }}
                    >
                        <DynamicBreadcrumbs/>
                        <DynamicContent/>
                        <DynamicFooter/>
                    </Layout>
                </Layout>
            </Layout>
            <SystemAnalisys/>
            <CookiesProvider>
                <AssessmentModal/>

            </CookiesProvider>
        </>
    );
}
export default  Home;