import Layout from "antd/es/layout/layout";
import LandHeader from "./header";
import { Col, Row } from "antd";
import CoursesModNews from "./CoursesModNews";
import SysNotificationsPreView from "../SysNotifications/preview";
import UpComingLecturesPreview from "../upcomingLectures/preview";

const LandingPage = ()=>{
    return (
        <>
            <Layout
            style={{backgroundColor:'transparent'}}
            >
                <LandHeader
                    style={{backgroundColor:'transparent'}}
                />
                <Layout.Content
                    style={{backgroundColor:'transparent',
                        padding:'20px'
                    }}
                >
                    <Row
                        justify={'center'}
                        style={{padding:'20px'}}
                    >
                        <Col span={12}>
                            <SysNotificationsPreView/>
                        
                        </Col>
                    </Row>

                    <Row
                        justify={'space-evenly'}
                        style={{padding:'20px'}}
                        wrap
                    >
                        <Col span={12} style={{minWidth:'450px'}}>
                            {/* <CoursesModNews /> */}
                        </Col>
                        <Col span={12} style={{minWidth:'450px'}}>
                            <UpComingLecturesPreview/>
                        </Col>
                    </Row>
                </Layout.Content>
            </Layout>
        </>
    )
}

export default LandingPage;