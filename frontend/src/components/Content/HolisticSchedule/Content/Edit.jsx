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
      rootStore.holosticScheduleContentStore.additionallyFetchedData = []
      fetchAdditional('building')
      fetchAdditional('floor')
      fetchAdditional('faculty')
      fetchAdditional('department')
      fetchAdditional('program')
      fetchAdditional('semester')
    },[])
    useEffect(()=>{
      setadditionalData(rootStore.holosticScheduleContentStore.additionallyFetchedData)
    },[rootStore.holosticScheduleContentStore.additionallyFetchedData])
    useEffect(()=>{
      console.log(additionalData)
    },[additionalData])
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
            {model.edit.includes('shortname')&&
                <Form.Item
                    label="Shortname"
                    name="shortname"
                    rules={[
                        {
                          required: true,
                          message: `Please input a shortname for ${model.name}!`,
                        },
                      ]}
                    initialValue={localStorage.getItem(`${model.name}_shortname`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_shortname`,event.target.value)}
                    />
                </Form.Item>
            
            }
            {
              model.edit.includes('floor_number')&&
              <Form.Item
                label="Floor Number"
                name="floor_number"
                rules={[
                    {
                      required: true,
                      message: `Please input a floor number for ${model.name}!`,
                    },
                  ]}
                initialValue={localStorage.getItem(`${model.name}_edit_floor_number`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_floor_number`,event.target.value)}
                      type="number"
                      defaultValue={0}
                    />
                </Form.Item>
            }
            {
              model.edit.includes('semester_num')&&
              <Form.Item
                label="Semester Number"
                name="semester_num"
                rules={[
                    {
                      required: true,
                      message: `Please input a semester number for ${model.name}!`,
                    },
                  ]}
                initialValue={localStorage.getItem(`${model.name}_edit_semester_num`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_semester_num`,event.target.value)}
                      type="number"
                      defaultValue={0}
                    />
                </Form.Item>
            }
            {
              model.edit.includes('building')&&
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
                        localStorage.setItem(`${model.name}_alt_building`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_alt_building`)}
                    >
                      {additionalData.find(ad=>ad.target==='building').data.map(b=>{
                        return b.status&&<Select.Option key={b.id} value={b.id}>{b.code}</Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.edit.includes('faculty')&&
              additionalData.find(ad=>ad.target==='faculty')&&
              <Form.Item
                label="Faculty"
                name="faculty"
                rules={[
                    {
                      required: true,
                      message: `Please select a faculty for ${model.name}!`,
                    },
                  ]}
                >
                    <Select
                      onSelect={(event)=>{
                        localStorage.setItem(`${model.name}_edit_faculty`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_faculty`)}
                    >
                      {additionalData.find(ad=>ad.target==='faculty').data.map(b=>{
                        return b.status&&<Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.edit.includes('department')&&
              additionalData.find(ad=>ad.target==='department')&&
              <Form.Item
                label="Department"
                name="department"
                rules={[
                    {
                      required: true,
                      message: `Please select a department for ${model.name}!`,
                    },
                  ]}
                >
                    <Select
                      onSelect={(event)=>{
                        localStorage.setItem(`${model.name}_department`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_edit_department`)}
                    >
                      {additionalData.find(ad=>ad.target==='department').data.map(b=>{
                        return b.status&&<Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.edit.includes('program')&&
              additionalData.find(ad=>ad.target==='program')&&
              <Form.Item
                label="Program"
                name="program"
                rules={[
                    {
                      required: true,
                      message: `Please select a program for ${model.name}!`,
                    },
                  ]}
                >
                    <Select
                      onSelect={(event)=>{
                        localStorage.setItem(`${model.name}_edit_program`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_edit_program`)}
                    >
                      {additionalData.find(ad=>ad.target==='program').data.map(b=>{
                        return b.status&&<Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.edit.includes('floor')&&
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
                        localStorage.setItem(`${model.name}_edit_floor`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_edit_floor`)}
                    >
                      {additionalData.find(ad=>ad.target==='floor').data.map(f=>{
                        return f.status&&<Select.Option key={f.id} value={f.id}>
                          {additionalData.find(ad=>ad.target==='building')?.data
                          .find(b=>b.id===f.building&&b.status)?.code} - Floor 
                          {` ${f.floor_number}`}
                        </Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.edit.includes('semester')&&
              additionalData.find(ad=>ad.target==='semester')&&
              <Form.Item
              label="Semester"
              name="semester"
              rules={[
                {
                  required: true,
                  message: `Please select a semester for ${model.name}!`
                  },
                  ]}
                  >
                    <Select
                      onSelect={(event)=>{
                        localStorage.setItem(`${model.name}_edit_semster`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_edit_semester`)}
                    >
                      {additionalData.find(ad=>ad.target==='semester').data.map(b=>{
                        return b.status&&<Select.Option key={b.id} value={b.id}>{b.season} - {b.year}</Select.Option>
                      })

                      }

                    </Select>
                </Form.Item>
            }
            {
              model.edit.includes('capacity')&&
              <Form.Item
                label="Capacity"
                name="capacity"
                rules={[
                    {
                      required: true,
                      message: `Please input a Capacity for ${model.name}!`,
                    },
                  ]}
                initialValue={localStorage.getItem(`${model.name}_edite_capacity`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_capacity`,event.target.value)}
                      type="number"
                      defaultValue={0}
                    />
                </Form.Item>
            }
            {
              model.edit.includes('exm_capacity')&&
              <Form.Item
                label="Exam Capacity"
                name="exm_capacity"
                initialValue={localStorage.getItem(`${model.name}_edit_exm_capacity`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_exm_capacity`,event.target.value)}
                      type="number"
                      defaultValue={0}
                    />
                </Form.Item>
            }
            {model.edit.includes('usable_for_exm')&&
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
              model.edit.includes('room_type')&&
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
                        localStorage.setItem(`${model.name}_edit_room_type`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_edit_room_type`)}
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