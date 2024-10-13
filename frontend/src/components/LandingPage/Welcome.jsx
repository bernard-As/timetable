import { Button, Card, Image, Space, Tooltip } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { useState } from "react";
import { Link } from "react-router-dom";

const Welcome = ({isLogin}) =>{
    const [ellipsis,setellipsis] = useState(true)
    return(
        <center>
            <Card>
                <Space
                    align="center"
                    direction="horizontal"
                >
                    <div>
                        <h2>Welcome to Rauf Denktas University Timetable System</h2>
                        <Paragraph 
                            ellipsis={ellipsis ? 
                            { rows: 4, expandable: true, symbol: 'more' }
                            : false}
                            className="welcome-text"
                        >
                            Welcome to the university's timetable platform, your go-to tool for managing course schedules, room bookings, and lecturer details. Whether you're a student or lecturer, this system provides real-time updates and easy access to all your academic scheduling needs. Stay organized and informed with just a few clicks. Best of luck in your studies!
                        </Paragraph>
                        <Space
                            direction="horizontal"
                        >
                            <Button block
                                type="primary"
                            >
                                <Link to={isLogin?"/home":"/login"}>
                                    {isLogin?
                                        <Tooltip
                                            title="You will be redirected to the home page"
                                        >
                                            Home
                                        </Tooltip>:
                                        <Tooltip
                                            title="You will be redirected to the login page"
                                        >
                                            Login
                                        </Tooltip>
                                    }
                                </Link>
                            </Button>
                            <Button block>
                                <Link to="/login">Find my advisor</Link>
                            </Button>
                            </Space>
                        
                    </div>
                    
                    <Image src="rdu-logo2.png" alt="RduLogo" className="welcome-logo"/>
                </Space>
                
            </Card>
        </center>
    )

}
export default Welcome;