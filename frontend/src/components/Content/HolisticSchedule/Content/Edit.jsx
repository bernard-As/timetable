import { Button, Card, Checkbox, Form, Input, Select } from "antd"
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import rootStore from "../../../../mobx";
import { useEffect, useState } from "react";

const Edit=()=>{
    const model = rootStore.holosticScheduleContentStore.currentModel;
    const id = rootStore.holosticScheduleContentStore.edit.recordToEdit;
    const [data,setData] = useState()
  const [additionalData,setadditionalData] = useState([]);
  useEffect(()=>{
        PrivateDefaultApi.get(`${model.apiUrl}/${id}/`).then((res)=>{
            setData(res.data)
        }).catch((error)=>{
            console.error(error)
        })
    },[id])
    const fetchAdditional = (targetModel,id=null) =>{
      let url = targetModel+'/';
      if(id)
        url = url+id+'/'
      PrivateDefaultApi.get(url).then((res)=>{
        console.log('hello')
        setadditionalData([...additionalData, {
          target:targetModel,
          data:res.data

        }])
      }).catch((error)=>{
        console.log(error);
      })
    }
    useEffect(()=>{
      fetchAdditional('building')
    },[])
    const [form] = Form.useForm();
    const normalUpdate = (values)=>{
        PrivateDefaultApi.patch(`${model.apiUrl}/${id}/`,values).then((res)=>{
            rootStore.holisticScheduleStore.deleteLocalStorageItemWith(`${model.name}_edit_`)
            rootStore.notification.notify({
              type:'success',
              text:`${model.name } updated `
            })
            // form.resetFields()
        }).catch((error)=>{
          console.log(error);
        })
    }
    const onFinishFailed = (errorInfo) => {
        rootStore.notification.notify({
            type: 'error',
            title:'Fail to update '+model.name,
            text:'Fail to update '+model.name,
            timeout:1500
        })
        console.log('Failed:', errorInfo);
    };
    return (
        <>{
        data&&<Form
            name="add"
            onFinish={normalUpdate}
            onFinishFailed={onFinishFailed}
            initialValues={data}
            // defaultValue={data}
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
            {model.edit.includes('name')&&
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                          required: true,
                          message: `Please input a name for ${model.name}!`,
                        },
                      ]}
                    //   initialValue={data.name}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_name`,event.target.value)}
                    />
                </Form.Item>
            
            }
            {model.edit.includes('code')&&
                <Form.Item
                    label="Code"
                    name="code"
                    rules={[
                        {
                          required: true,
                          message: `Please input a code for ${model.name}!`,
                        },
                      ]}
                    // initialValue={localStorage.getItem(`${model.name}_edit_code`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_code`,event.target.value)}
                    />
                </Form.Item>
            
            }
            {
              model.addFields.includes('floor_number')&&
              <Form.Item
                label="Floor Number"
                name="floor_number"
                rules={[
                    {
                      required: true,
                      message: `Please input a floor number for ${model.name}!`,
                    },
                  ]}
                initialValue={localStorage.getItem(`${model.name}_floor_number`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_floor_number`,event.target.value)}
                      type="number"
                      defaultValue={0}
                    />
                </Form.Item>
            }
            {
              model.addFields.includes('building')&&
              additionalData.find(ad=>ad.target==='building')&&
              <Form.Item
                label="Building"
                name="building"
                rules={[
                    {
                      required: true,
                      message: `Please select a building for ${model.name}!`,
                    },
                  ]}
                >
                    <Select
                      onSelect={(event)=>{
                        localStorage.setItem(`${model.name}_building`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_building`)}
                    >
                      {additionalData.find(ad=>ad.target==='building').data.map(b=>{
                        return <Select.Option key={b.id} value={b.id}>{b.code}</Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {model.edit.includes('status')&&
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
                Update
              </Button>
            </Form.Item>
        </Form>}
        </>
    )
}
export default Edit;