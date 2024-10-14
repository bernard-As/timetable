import Layout from "antd/es/layout/layout";
import LandHeader from "./header";
import { Col, FloatButton, Row, Space, Tooltip } from "antd";
import CoursesModNews from "./CoursesModNews";
import SysNotificationsPreView from "../SysNotifications/preview";
import UpComingLecturesPreview from "../upcomingLectures/preview";
import DynamicFooter from "../Footer";
import Welcome from "./Welcome";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import rootStore from "../../mobx";
import { MdOutlineMenuOpen } from "react-icons/md";
import { PiUnionBold } from "react-icons/pi";
import { SiMoodle } from "react-icons/si";
import { CgWebsite } from "react-icons/cg";
import { MdSupportAgent } from "react-icons/md";
import Cookies from "js-cookie";
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
import AdvisorList from "../AdvidorList";
const LandingPage = ()=>{
    const [isLogin,setisLogin] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        const checkTokenValidity2 = async()=> {
          Cookies.get('token') !==null  &&
          await PrivateDefaultApi.post('verify_token').then((res)=>{
              if(res.status === 401){
                  setisLogin(false)
              }else{
                rootStore.credential = res.data.credential
                setisLogin(true)
              }
          }).catch((error)=>{
            
          })
        }
        checkTokenValidity2()

    },[navigate])

    return (
        <>
            <Layout
            style={{backgroundColor:'transparent'}}
            >
                <LandHeader
                    style={{backgroundColor:'transparent'}}
                    isLogin={isLogin}
                />
                <Layout.Content
                    style={{backgroundColor:'transparent',
                        padding:'20px'
                    }}
                >
                    
                    <Welcome
                        isLogin={isLogin}
                    />
                    <Row
                        justify={'space-evenly'}
                        style={{padding:'20px'}}
                        wrap
                    >
                        <Col span={12} style={{minWidth:'450px'}}>
                            <SysNotificationsPreView/>
                        </Col>
                        <Col span={12} style={{minWidth:'450px'}}>
                            <UpComingLecturesPreview/>
                        </Col>
                    </Row>
                    <Row
                        justify={'space-evenly'}
                        style={{padding:'20px'}}
                        wrap
                    >
                        <Col span={12} style={{minWidth:'450px'}} id="advisor">
                            <AdvisorList />
                        </Col>
                        {/* <Col span={12} style={{minWidth:'450px'}}>
                            <UpComingLecturesPreview/>
                        </Col> */}
                    </Row>
                    <FloatButton.Group
                        key={'bottom-right'}
                        trigger="click"
                        placement={'bottom-right'}
                        icon={<MdOutlineMenuOpen />}
                    >
                        <Tooltip title = 'Navigate to Student portal platform'>
                            <Link to='https://studentsupport.rdu.edu.tr'><FloatButton icon={<MdSupportAgent />}/></Link>
                        </Tooltip>
                        <Tooltip title = 'Navigate to RDU website'>
                            <Link to='https://rdu.edu.tr'><FloatButton icon={<CgWebsite />}/></Link>
                        </Tooltip>
                        <Tooltip title = 'Navigate to LMS/Moodle platform'>
                            <Link to='https://lms.rdu.edu.tr'><FloatButton icon={<SiMoodle />}/></Link>
                        </Tooltip>
                        <Tooltip title = 'Navigate to Uniheart  platform'>
                            <Link to='https://uniheart.rdu.edu.tr'><FloatButton icon={<PiUnionBold />}/></Link>
                        </Tooltip>
                    </FloatButton.Group>
                </Layout.Content>
                <DynamicFooter/>
            </Layout>
        </>
    )
}

export default LandingPage;