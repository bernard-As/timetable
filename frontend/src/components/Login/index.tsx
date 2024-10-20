import { Badge, Card, Col, ConfigProvider, Divider, Drawer, Layout, Row, Space } from "antd";
import LoginForm from "./login.form";
import rootStore from "../../mobx";
import DynamicFooter from "../Footer";
import SysNotificationsPreView from "../SysNotifications/preview";
import { FaRegBell } from "react-icons/fa6";
import { useState } from "react";
const Login:React.FC = () =>{
    const [showNotification, setShowNotification] = useState(false)
    return (<>
        <Layout
            style={{
                height:'100vh'
            }}
        >
            <Layout.Header
                style={{
                    display:rootStore.holisticScheduleStore.isPhone()?'block':'none',
                    backgroundColor:'transparent'
                }}
            >
                <Row
                    justify={'end'}
                    style={{
                        width:'100%',
                        alignContent:'end',
                        alignItems:'end',
                        
                    }}
                >
                    <Col span={24}
                        style={{
                            width:'100%',
                            alignContent:'end',
                            alignItems:'end',
                            textAlign:'end',
                        }}
                    >
                        <span
                            onClick={()=>{
                                setShowNotification(true)
                            }}
                            style={{
                                cursor:'pointer',
                            }}
                        >
                            <ConfigProvider
                              theme={{
                                components: {
                                  Badge: {
                                    dotSize:12
                                  },
                                },
                              }}
                            >
                            <Badge dot >
                                <FaRegBell size={25}/>
                            </Badge>
                            </ConfigProvider>
                        </span>
                        
                    </Col>
                </Row>
            </Layout.Header>
            <Layout.Content
                style={{
                    alignItems:'center'
                }}
            >
                <Drawer 
                    title={null} 
                    onClose={()=>{
                        setShowNotification(false)
                    }} 
                    open={showNotification}
                >
                    <SysNotificationsPreView/>
                </Drawer>
                <Row
                    justify={'center'}
                    style={{
                        height:'100%',
                        padding:rootStore.holisticScheduleStore.isPhone()?'3%':'10%',
                    }}
                >
                    <Col span={rootStore.holisticScheduleStore.isPhone()?0:11}>
                        <SysNotificationsPreView/>
                    </Col>
                    <Col span={rootStore.holisticScheduleStore.isPhone()?0:1}>
                        <Divider type="vertical" className="horiz_devider" orientation="center"/>
                    </Col>
                    <Col span={rootStore.holisticScheduleStore.isPhone()?24:11}>
                        <Card
                            className="loginCard"
                        >
                            <h1>Login</h1>
                            <LoginForm/>
                        </Card>
                    </Col>
                </Row>
                {/* </Space> */}
            </Layout.Content>
            <Layout.Footer>
                <DynamicFooter/>
            </Layout.Footer>
        </Layout>
    </>
        
    );
}

export default Login;