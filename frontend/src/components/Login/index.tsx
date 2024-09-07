import { Card, Divider, Space } from "antd";
import LoginForm from "./login.form";

const Login:React.FC = () =>{

    return (
        <Space
            align="center"
            direction="horizontal"
            style={{minWidth:'100%'}}
        >
            <Card
                className="loginNotifications"
            >
                System Notifications
            </Card>
            <Divider type="vertical" className="horiz_devider" orientation="center"/>
            <Card
                className="loginCard"
            >
                <h1>Login</h1>
                <LoginForm/>
            </Card>
        </Space>
    );
}

export default Login;