import { Button, Checkbox, Form, Input } from "antd";
import rootStore from "../../../../mobx";
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import { observer } from "mobx-react";

const Add  = observer(({model})=>{
  const [form] = Form.useForm();
    const normalAdd = (values)=>{
        PrivateDefaultApi.post(`${model.apiUrl}/`,values).then((res)=>{
            console.log(res);
            rootStore.holisticScheduleStore.deleteLocalStorageItemWith(`${model.name}_`)
            rootStore.notification.notify({
              type:'success',
              text:`${model.name } created `
            })
            form.resetFields()
        }).catch((error)=>{
          console.log(error);
        })
    }
    const onFinishFailed = (errorInfo) => {
        rootStore.notification.notify({
            type: 'error',
            title:'Fail to add a new '+model.name,
            text:'Fail to add a new '+model.name,
            timeout:1500
        })
        console.log('Failed:', errorInfo);
    };
    return (
        <Form
            name="add"
            onFinish={normalAdd}
            onFinishFailed={onFinishFailed}
            initialValues={{
                status:true,
            }}
            form={form}
            autoComplete="off"
            labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              // onReset={}
        >
            {model.addFields.includes('name')&&
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                          required: true,
                          message: `Please input a name for ${model.name}!`,
                        },
                      ]}
                    initialValue={localStorage.getItem(`${model.name}_name`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_name`,event.target.value)}
                    />
                </Form.Item>
            
            }
            {model.addFields.includes('code')&&
                <Form.Item
                    label="Code"
                    name="code"
                    rules={[
                        {
                          required: true,
                          message: `Please input a code for ${model.name}!`,
                        },
                      ]}
                    initialValue={localStorage.getItem(`${model.name}_code`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_code`,event.target.value)}
                    />
                </Form.Item>
            
            }
            {model.addFields.includes('status')&&
                <Form.Item
                  name="status"
                  valuePropName="checked"
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Checkbox>Enable</Checkbox>
                </Form.Item>
            }
            <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
        </Form>
    )
}
)
export default Add;