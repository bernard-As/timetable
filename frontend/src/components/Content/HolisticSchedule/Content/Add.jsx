import { Button, Checkbox, Form, Input, Select } from "antd";
import rootStore from "../../../../mobx";
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

const Add  = observer(({model})=>{
  const [form] = Form.useForm();
  const [additionalData,setadditionalData] = useState([]);
    const normalAdd = (values)=>{
        PrivateDefaultApi.post(`${model.apiUrl}/`,values).then((res)=>{
            rootStore.holisticScheduleStore.deleteLocalStorageItemWith(`${model.name}_`)
            rootStore.notification.notify({
              type:'success',
              text:`${model.name.toUpperCase() } created `
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
    
    const fetchAdditional = (targetModel,id=null) =>{
      let url = targetModel+'/';
      if(id)
        url = url+id+'/'
      PrivateDefaultApi.get(url).then((res)=>{
        console.log('hello')
        rootStore.holosticScheduleContentStore.addadditionallyFetchedData({
          target:targetModel,
          data:res.data

        })
        return 
      }).catch((error)=>{
        console.log(error);
      })
    }
    useEffect(()=>{
      fetchAdditional('building')
      fetchAdditional('floor')
    },[])
    useEffect(()=>{
      setadditionalData(rootStore.holosticScheduleContentStore.additionallyFetchedData)
    },[rootStore.holosticScheduleContentStore.additionallyFetchedData])
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
            {
              model.addFields.includes('floor')&&
              additionalData.find(ad=>ad.target==='floor')&&
              <Form.Item
                label="Floor"
                name="floor"
                rules={[
                    {
                      required: true,
                      message: `Please select a floor for ${model.name}!`,
                    },
                  ]}
                >
                    <Select
                      onSelect={(event)=>{
                        localStorage.setItem(`${model.name}_floor`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_floor`)}
                    >
                      {additionalData.find(ad=>ad.target==='floor').data.map(f=>{
                        return <Select.Option key={f.id} value={f.id}>
                          {additionalData.find(ad=>ad.target==='building')?.data
                          .find(b=>b.id===f.building)?.code} - Floor 
                          {` ${f.floor_number}`}
                        </Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.addFields.includes('capacity')&&
              <Form.Item
                label="Capacity"
                name="capacity"
                rules={[
                    {
                      required: true,
                      message: `Please input a Capacity for ${model.name}!`,
                    },
                  ]}
                initialValue={localStorage.getItem(`${model.name}_capacity`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_capacity`,event.target.value)}
                      type="number"
                      defaultValue={0}
                    />
                </Form.Item>
            }
            {
              model.addFields.includes('exm_capacity')&&
              <Form.Item
                label="Exam Capacity"
                name="exm_capacity"
                initialValue={localStorage.getItem(`${model.name}_exm_capacity`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_exm_capacity`,event.target.value)}
                      type="number"
                      defaultValue={0}
                    />
                </Form.Item>
            }
            {model.addFields.includes('usable_for_exm')&&
                <Form.Item
                  name="usable_for_exm"
                  valuePropName="checked"
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Checkbox>Usable For Exam</Checkbox>
                </Form.Item>
            }
            {
              model.addFields.includes('room_type')&&
              <Form.Item
                label="Room Type"
                name="room_type"
                rules={[
                    {
                      required: true,
                      message: `Please select a Room Type for ${model.name}!`,
                    },
                  ]}
                >
                    <Select
                      onSelect={(event)=>{
                        localStorage.setItem(`${model.name}_room_type`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_room_type`)}
                      options={[
                        {
                          value:'LEC',
                          label:'Lecture Room'
                        },
                        {
                          value:'LAB',
                          label:'Laboratory'
                        },
                        {
                          value:'SEM',
                          label:'Seminar Room'
                        },
                        {
                          value:'STU',
                          label:'Studio'
                        },
                        {
                          value:'WOR',
                          label:'Workshop'
                        },
                        {
                          value:'OFF',
                          label:'Office'
                        },
                        {
                          value:'OTH',
                          label:'Other'
                        },

                      ]}
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