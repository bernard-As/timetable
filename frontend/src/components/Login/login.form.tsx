import React, { useEffect } from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import Cookies from 'js-cookie';
import { PublicDefaultApi } from '../../utils/AxiosInstance';
import rootStore from '../../mobx';
import { useNavigate } from 'react-router-dom';

type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    localStorage.clear()
  },[navigate])
  const [form] = Form.useForm(); // Use Form instance to control the form

  const handleNavigation = () => {
    const referrer = document.referrer;
    const currentHostname = window.location.hostname;

    try {
      const referrerUrl = new URL(referrer);

      if (referrerUrl.hostname.endsWith(currentHostname) && (referrer!==`${process.env.REACT_APP_BASE_URL}welcome` && referrer!==`${process.env.REACT_APP_BASE_URL}login`)) {
        // Same subdomain, navigate to the referrer
        // navigate(referrer);
        window.location.href=`${process.env.REACT_APP_BASE_URL}`

      } else {
        // Different subdomain, navigate to the base URL
        window.location.href=`${process.env.REACT_APP_BASE_URL}`
        // navigate(`/home`);
      }
    } catch (error) {
      // If referrer is not a valid URL or any other issue
        window.location.href=`${process.env.REACT_APP_BASE_URL}welcome`
        console.info(error)
    }
  };
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    if (values.remember) {
      Cookies.set('remember', 'true');
      values.username && Cookies.set('email', values.username);
      values.password && Cookies.set('pwd', values.password);
    }
    PublicDefaultApi.post('login/', values)
      .then((res) => {
        if (res.status === 200) {
          Cookies.set('token',res.data.token);
          console.log(res.data.token)
          rootStore.notification.notify({
            title: 'You are logged in',
            text: 'Welcome back',
            type: 'success',
            timeout: 1500,
          });
          setTimeout(() => {
            handleNavigation()
          }, 500);
        } else {
          rootStore.notification.notify({
            title: 'Could not login. Failed to connect to server',
            text: 'Please try again. Failed to connect to server',
            type: 'error',
            timeout: 2500,
          });
        }
      })
      .catch((err) => {
        console.error(err)
        rootStore.notification.notify({
          title: 'Could not login. Please check the fields',
          text: 'Could not login. Please check the fields',
          type: 'error',
          timeout: 2500,
        });
      });
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = () => {
    rootStore.notification.notify({
      title: 'Please check the fields again',
      text: 'Please check the fields again',
      type: 'error',
      timeout: 2500,
    });
  };

  useEffect(() => {
    const remember = Cookies.get('remember');
    if (remember) {
      form.setFieldsValue({
        remember: true,
        username: Cookies.get('email') || '',
        password: Cookies.get('pwd') || '',
      });
    }
  }, [form]);

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Email"
        name="username"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
