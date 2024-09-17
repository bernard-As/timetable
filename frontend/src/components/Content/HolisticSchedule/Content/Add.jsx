import { Button, Checkbox, Form, Input, Select, Space } from "antd";
import rootStore from "../../../../mobx";
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

const Add  = observer(({model})=>{
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [additionalData,setadditionalData] = useState([])
  const [selectedFaculty,setselectedFaculty] = useState([])
  const [selectedDepartment,setselectedDepartment] = useState([])
  const [selectedProgram,setselectedProgram] = useState([])
  const [selectedBuilding,setselectedBuilding] = useState([])
  const [selectFloor,setselectFloor] = useState([])
    const normalAdd = (values)=>{
      if(values['email']!==undefined&&values.email.split('@')[1]!==(undefined||'rdu.edu.tr')){
        if(values.email.split('@')[1]!==undefined){
          values.email = values.email.split('@')[0] + '@rdu.edu.tr'

        }else{
          values.email = values.email+'@rdu.edu.tr'
        }
      }
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
      rootStore.holosticScheduleContentStore.additionallyFetchedData = []
      fetchAdditional('building')
      fetchAdditional('floor')
      fetchAdditional('faculty')
      fetchAdditional('department')
      fetchAdditional('program')
      fetchAdditional('semester')
      fetchAdditional('title')
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
            {model.addFields.includes('username')&&
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                          required: true,
                          message: `Please input a username for ${model.name}!`,
                        },
                      ]}
                    initialValue={localStorage.getItem(`${model.name}_username`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_username`,event.target.value)}
                    />
                </Form.Item>
            
            }
            {model.addFields.includes('first_name')&&
                <Form.Item
                    label="First Name"
                    name="first_name"
                    rules={[
                        {
                          required: true,
                          message: `Please input a first_name for ${model.name}!`,
                        },
                      ]}
                    initialValue={localStorage.getItem(`${model.name}_first_name`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_first_name`,event.target.value)}
                    />
                </Form.Item>
            
            }
            {model.addFields.includes('last_name')&&
                <Form.Item
                    label="Last Name"
                    name="last_name"
                    rules={[
                        {
                          required: true,
                          message: `Please input a last_name for ${model.name}!`,
                        },
                      ]}
                    initialValue={localStorage.getItem(`${model.name}_last_name`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_last_name`,event.target.value)}
                    />
                </Form.Item>
            
            }
            { model.addFields.includes('email')&&
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
              initialValue={localStorage.getItem(`${model.name}_email`)}

            >
              <Input 
                onKeyUp={(event)=>localStorage.setItem(`${model.name}_email`,event.target.value)}
                addonAfter="@rdu.edu.tr"
              />
            </Form.Item>
            }
            {model.addFields.includes('password')&&
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                          required: true,
                          message: `Please input a password for ${model.name}!`,
                        },
                      ]}
                    initialValue={localStorage.getItem(`${model.name}_username`)}
                >
                  <Space direction="horizontal">
                    <Input.Password
                      placeholder="input password"
                      visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_username`,event.target.value)}
                      />
                    <Button style={{ width: 80 }} onClick={() => setPasswordVisible((prevState) => !prevState)}>
                      {passwordVisible ? 'Hide' : 'Show'}
                    </Button>
                  </Space>
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
            {model.addFields.includes('shortname')&&
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
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_shortname`,event.target.value)}
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
              model.addFields.includes('semester_num')&&
              <Form.Item
                label="Semester Number"
                name="semester_num"
                rules={[
                    {
                      required: true,
                      message: `Please input a semester number for ${model.name}!`,
                    },
                  ]}
                initialValue={localStorage.getItem(`${model.name}_semester_num`)}
                >
                    <Input 
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_semester_num`,event.target.value)}
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
                        setselectedBuilding([...selectedBuilding.filter(b=>b!==event),event])
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_building`)}
                    >
                      {additionalData.find(ad=>ad.target==='building').data.map(b=>{
                        return b.status&&<Select.Option key={b.id} value={b.id}>{b.code}</Select.Option>
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
                        setselectFloor([...[selectFloor.filter(f=>f!==event)],event])
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_floor`)}
                    >
                      {additionalData.find(ad=>ad.target==='floor').data.map(f=>{
                        return f.status&&
                        (selectedBuilding.length===0||selectedBuilding.includes(f.building))&&
                        <Select.Option key={f.id} value={f.id}>
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
              model.addFields.includes('title')&&
              additionalData.find(ad=>ad.target==='title')&&
              <Form.Item
                label="Title"
                name="title"
                rules={[
                    {
                      required: true,
                      message: `Please select a title for ${model.name}!`,
                    },
                  ]}
                >
                    <Select
                      onSelect={(event)=>{
                        localStorage.setItem(`${model.name}_title`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_title`)}
                    >
                      {additionalData.find(ad=>ad.target==='title').data.map(b=>{
                        return b.status&&<Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.addFields.includes('title')&&
              additionalData.find(ad=>ad.target==='title')&&
              <Form.Item
                label="Title"
                name="title"
                rules={[
                    {
                      required: true,
                      message: `Please select a title for ${model.name}!`,
                    },
                  ]}
                >
                    <Select
                      onSelect={(event)=>{
                        localStorage.setItem(`${model.name}_title`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_title`)}
                    >
                      {additionalData.find(ad=>ad.target==='title').data.map(b=>{
                        return b.status&&<Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.addFields.includes('faculty')&&
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
                        localStorage.setItem(`${model.name}_faculty`,event)
                        setselectedFaculty([...selectedFaculty.filter(f=>f!==event),event])
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
              model.addFields.includes('department')&&
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
                        setselectedDepartment([...selectedDepartment.filter(d=>d!==event),event])

                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_department`)}
                    >
                      {additionalData.find(ad=>ad.target==='department').data.map(d=>{
                        return d.status&&
                        (selectedFaculty.length===0||selectedFaculty.includes(d.faculty))&&
                        <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.addFields.includes('program')&&
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
                        localStorage.setItem(`${model.name}_program`,event)
                        setselectedProgram([...selectedProgram.filter(p=>p!==event),event])
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_program`)}
                    >
                      {additionalData.find(ad=>ad.target==='program').data.map(p=>{
                        return p.status&&
                        (selectedDepartment.length===0||selectedDepartment.includes(p.department))&&
                        <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.addFields.includes('semester')&&
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
                        localStorage.setItem(`${model.name}_semster`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_semester`)}
                    >
                      {additionalData.find(ad=>ad.target==='semester').data.map(b=>{
                        return b.status&&
                        (selectedProgram.length===0||selectedProgram.includes(b.program))&&
                        <Select.Option key={b.id} value={b.id}>{b.season} - {b.year}</Select.Option>
                      })

                      }

                    </Select>
                </Form.Item>
            }
            {
              model.addFields.includes('faculty_m')&&
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
                        localStorage.setItem(`${model.name}_faculty_m`,event)
                        setselectedFaculty([...selectedFaculty.filter(f=>f!==event),event])
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_faculty_m`)}
                      maxTagCount={'resposive'}
                      mode="multiple"
                    >
                      {additionalData.find(ad=>ad.target==='faculty').data.map(b=>{
                        return b.status&&<Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.addFields.includes('department_m')&&
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
                        localStorage.setItem(`${model.name}_department_m`,event)
                        setselectedDepartment([...selectedDepartment.filter(d=>d!==event),event])

                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      mode="multiple"
                      maxTagCount={'resposive'}
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_department_m`)}
                    >
                      {additionalData.find(ad=>ad.target==='department').data.map(d=>{
                        return d.status&&
                        (selectedFaculty.length===0||selectedFaculty.includes(d.faculty))&&
                        <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
                      })

                      }

                    </Select>

                </Form.Item>
            }
            {
              model.addFields.includes('program_m')&&
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
                        localStorage.setItem(`${model.name}_program_m`,event)
                        setselectedProgram([...selectedProgram.filter(p=>p!==event),event])
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      maxTagCount={'resposive'}
                      mode="multiple"
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_program_m`)}
                    >
                      {additionalData.find(ad=>ad.target==='program').data.map(p=>{
                        return p.status&&
                        (selectedDepartment.length===0||selectedDepartment.includes(p.department))&&
                        <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
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
            {
              model.addFields.includes('credential')&&
              <Form.Item
                label="Credential"
                name="credential"
                rules={[
                    {
                      required: true,
                      message: `Please select a Credential for ${model.name}!`,
                    },
                  ]}
                >
                    <Select
                      onSelect={(event)=>{
                        localStorage.setItem(`${model.name}_credential`,event)
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      initialValue={localStorage.getItem(`${model.name}_credential`)}
                      options={[
                        {
                          value:'PADM',
                          label:'Platform Admin'
                        },
                        {
                          value:'VR',
                          label:'Vice Rector'
                        },
                        {
                          value:'HOD',
                          label:'Head Of Department'
                        },
                        {
                          value:'OTH',
                          label:'Other'
                        },

                      ]}
                    />
                      

                </Form.Item>
            }
            {model.extraField !== undefined&&
              model.extraField.includes('group_number')&&
              <Form.Item
                label="Group number"
                name="group_number"
                rules={[
                    {
                      required: true,
                      message: `Please input a group number for ${model.name}!`,
                    },
                  ]}
                initialValue={localStorage.getItem(`${model.name}_group_number`)}
              >
                <Input 
                  onKeyUp={(event)=>localStorage.setItem(`${model.name}_group_number`,event.target.value)}
                  type="number"
                  defaultValue={0}
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