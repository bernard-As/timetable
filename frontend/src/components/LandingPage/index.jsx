import Layout from "antd/es/layout/layout";
import LandHeader from "./header";
import SystNewsNotification from "./SysNotifications";
import { Col, Row } from "antd";
import CoursesModNews from "./CoursesModNews";
import UpComingLectures from "./UpComingLectures";

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
                    style={{backgroundColor:'transparent'}}
                >
                    <SystNewsNotification/>
                    <Row
                        justify={'space-evenly'}

                    >
                        <Col span={12}>
                            <CoursesModNews/>
                        </Col>
                        <Col span={12}>
                            <UpComingLectures/>
                        </Col>
                    </Row>
                </Layout.Content>
            </Layout>
        </>
    )
}

export default LandingPage;