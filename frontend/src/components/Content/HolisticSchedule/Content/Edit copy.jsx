import { Button, Card, Checkbox, DatePicker, Divider, Form, Input, InputNumber, Segmented, Select, Space, TimePicker, Tooltip } from "antd"
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import rootStore from "../../../../mobx";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';

const Edit=()=>{
    const model = rootStore.holosticScheduleContentStore.currentModel;
    const id = rootStore.holosticScheduleContentStore.edit.recordToEdit;
    const [data,setData] = useState()
  const [additionalData,setadditionalData] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedFaculty,setselectedFaculty] = useState([])
  const [selectedDepartment,setselectedDepartment] = useState([])
  const [selectedProgram,setselectedProgram] = useState([])
  const [selectedBuilding,setselectedBuilding] = useState([])
  const [selectFloor,setselectFloor] = useState([])
  const [typeSelected, setTypeSElected] = useState('Weekly')
  const [data1,setData1] = useState([])
  const [dataRoom,setDataRoom] = useState([])

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
      fetchAdditional('title')
      fetchAdditional('lecturer')
      fetchAdditional('course')
      fetchAdditional('assistant')
      fetchAdditional('activitytype')
      fetchAdditional('coursegroup')
      fetchAdditional('coursesemester')
    },[])
    useEffect(()=>{
      setadditionalData(rootStore.holosticScheduleContentStore.additionallyFetchedData)
    },[rootStore.holosticScheduleContentStore.additionallyFetchedData])
    useEffect(()=>{
      console.log(additionalData)
    },[additionalData])
    const [form] = Form.useForm();
    const normalUpdate = (values)=>{
      if(values['email']!==undefined&&values.email.split('@')[1]!==(undefined||'rdu.edu.tr')){
        if(values.email.split('@')[1]!==undefined){
          values.email = values.email.split('@')[0] + '@rdu.edu.tr'

        }else{
          values.email = values.email+'@rdu.edu.tr'
        }
      }
      if(values.date!==undefined)values.date=values.date.format('YYYY-MM-DD')
        if(values.day!==undefined)values.day=rootStore.holosticScheduleContentStore.daysIndex.find(p=>p.name===values.day).id
        if(values.start!==undefined)values.end =  values.start[1].format('HH:mm')
        if(values.start!==undefined)values.start =  values.start[0].format('HH:mm')
        PrivateDefaultApi.patch(`${model.apiUrl}/${id}/`,values).then((res)=>{
            rootStore.holisticScheduleStore.deleteLocalStorageItemWith(`${model.name}_edit_`)
            rootStore.notification.notify({
              type:'success',
              text:`${model.name } updated `
            })
            // form.resetFields()
        }).catch((error)=>{
          console.log(error);
          if(model.name==='create_schedule')
            rootStore.notification.notify({
              type:'An Error occur it might be a clash ',
              text:`${model.name.toUpperCase() } created `
            })
        })
    }
    const onFinishFailed = (errorInfo) => {
      rootStore.notification.notify({
        type: 'error',
        title:'Fail to add a new '+model.name+' Please check the fields',
        text:'Fail to add a new '+model.name+' Please check the fields',
        timeout:1500
    })
        console.log('Failed:', errorInfo);
    };
    const onSearch= (value)=>{
      PrivateDefaultApi.get('coursegroup/?search='+value).then((res)=>{
          setData1(res.data)
      }).catch((error)=>{
          console.error(error)
      })
  }
  const onSearchRoom= (value)=>{
      PrivateDefaultApi.get('room/?search='+value).then((res)=>{
          setDataRoom(res.data)
      }).catch((error)=>{
          console.error(error)
      })
  }
    return (<>
      {data&&<Form
          name="add"
          onFinish={normalUpdate}
          onFinishFailed={onFinishFailed}
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
                  initialValue={data.name}
                  defaultValue={data.name}
              >
                  <Input 
                    onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_name`,event.target.value)}
                  />
              </Form.Item>
          
          }
          {model.edit.includes('first_name')&&
              <Form.Item
                  label="First Name"
                  name="first_name"
                  rules={[
                      {
                        required: true,
                        message: `Please input a first_name for ${model.name}!`,
                      },
                    ]}
                    initialValue={data.first_name}
              >
                  <Input 
                    onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_first_name`,event.target.value)}
                  />
              </Form.Item>
          
          }
          {model.edit.includes('last_name')&&
              <Form.Item
                  label="Last Name"
                  name="last_name"
                  rules={[
                      {
                        required: true,
                        message: `Please input a last_name for ${model.name}!`,
                      },
                    ]}
                    initialValue={data.last_name}
              >
                  <Input 
                    onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_last_name`,event.target.value)}
                  />
              </Form.Item>
          
          }
          { model.edit.includes('email')&&
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
            initialValue={data.email}

          >
            <Input 
              onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_email`,event.target.value)}
              addonAfter="@rdu.edu.tr"
            />
          </Form.Item>
          }
          {model.edit.includes('password')&&
              <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                      {
                        required: true,
                        message: `Please input a password for ${model.name}!`,
                      },
                    ]}
                  initialValue={localStorage.getItem(`${model.name}_password`)}
              >
                <Space direction="horizontal">
                  <Input.Password
                    placeholder="input password"
                    visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                    onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_username`,event.target.value)}
                    />
                  <Button style={{ width: 80 }} onClick={() => setPasswordVisible((prevState) => !prevState)}>
                    {passwordVisible ? 'Hide' : 'Show'}
                  </Button>
                </Space>
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
                    initialValue={data.code}
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
                    initialValue={data.shortname}
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
                initialValue={data.floor_number}
              >
                  <InputNumber
                    onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_floor_number`,event.target.value)}
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
                initialValue={data.semester_num}
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
                initialValue={{label:additionalData.find(b=>b.target==='building')?.data.find(d=>d.id===data.building)?.shortname,value:data.building}}
                >
                  <Select
                    onSelect={(event)=>{
                      localStorage.setItem(`${model.name}_edit_building`,event)
                      setselectedBuilding([...selectedBuilding.filter(b=>b!==event),event])
                    }}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    allowClear
                    initialValue={{label:additionalData.find(b=>b.target==='building')?.data.find(d=>d.id===data.building)?.shortname,value:data.building}}
                  >
                    {additionalData.find(ad=>ad.target==='building').data.map(b=>{
                      return b.status&&<Select.Option key={b.id} value={b.id}>{b.code}</Select.Option>
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
                initialValue={data.floor}
              >
                  <Select
                    onSelect={(event)=>{
                      localStorage.setItem(`${model.name}_edit_floor`,event)
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
            model.edit.includes('title')&&
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
                initialValue={{value:data.title}}
              >
                  <Select
                    onSelect={(event)=>{
                      localStorage.setItem(`${model.name}_edit_title`,event)
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
                initialValue={{value:data.faculty}}
              >
                  <Select
                    onSelect={(event)=>{
                      localStorage.setItem(`${model.name}_edit_faculty`,event)
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
                initialValue={{value:data.department}}
              >
                  <Select
                    onSelect={(event)=>{
                      localStorage.setItem(`${model.name}_edit_department`,event)
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
                initialValue={{value:data.program}}
              >
                  <Select
                    onSelect={(event)=>{
                      localStorage.setItem(`${model.name}_edit_program`,event)
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
                initialValue={{value:data.semester}}
              >
                  <Select
                    onSelect={(event)=>{
                      localStorage.setItem(`${model.name}_edit_semster`,event)
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
            model.edit.includes('faculty_m')&&
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
                      localStorage.setItem(`${model.name}_edit_faculty_m`,event)
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
            model.edit.includes('department_m')&&
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
                      localStorage.setItem(`${model.name}_edit_department_m`,event)
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
            model.edit.includes('program_m')&&
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
                initialValue={data.program}
              >
                  <Select
                    onSelect={(event)=>{
                      localStorage.setItem(`${model.name}_edit_program_m`,event)
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
              initialValue={data.capacity}
              >
                  <InputNumber
                    onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_capacity`,event.target.value)}
                    defaultValue={25}
                  />
              </Form.Item>
          }
          {
            model.edit.includes('exm_capacity')&&
            <Form.Item
              label="Exam Capacity"
              name="exm_capacity"
              initialValue={data.exm_capacity}
              >
                  <InputNumber
                    onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_exm_capacity`,event.target.value)}
                    defaultValue={0}
                  />
              </Form.Item>
          }
          {model.edit.includes('usable_for_exm')&&
              <Form.Item
                name="usable_for_exm"
                valuePropName={data.usable_for_exm?"checked":'unchecked'}
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
                initialValue={data.room_type}
              >
                  <Select
                    onSelect={(event)=>{
                      localStorage.setItem(`${model.name}_edit_room_type`,event)
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
            model.edit.includes('credential')&&
            <Form.Item
              label="Credential"
              name="credential"
              rules={[
                  {
                    required: true,
                    message: `Please select a Credential for ${model.name}!`,
                  },
                ]}
                initialValue={data.credential}
              >
                  <Select
                    onSelect={(event)=>{
                      localStorage.setItem(`${model.name}_edit_credential`,event)
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
          {model.edit.includes('status')&&
              <Form.Item
                name="status"
                valuePropName={data.status?"checked":'unchecked'}
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Checkbox>Enable</Checkbox>
              </Form.Item>
          }
          {model.extraField!==undefined&&<Form.List name="groups" initialValue={data.groups}>
              {(fields,{add,remove}) =>(
                  <>
                  {fields.map((field,index)=>{
                    return(
                      <>
                      <Card>
                        Group {index+1}
                      </Card>
                        {model.extraField.includes('group_number')&&<Form.Item
                          label="Group number"
                          name={[field.name,"group_number"]}
                          initialValue={index+1}
                        >
                          <InputNumber
                            onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_group_number_${index+1}`,event.target.value)}
                            defaultValue={index+1}
                            min={1}
                          />
                        </Form.Item>}
                        {model.extraField.includes('duration')&&<Form.Item
                          label="Duration"
                          name={[field.name,"duration"]}
                          initialValue={2}
                        >
                          <InputNumber 
                            onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_duration_${index+1}`,event.target.value)}
                            defaultValue={2}
                          />
                        </Form.Item>}
                        {model.extraField.includes('max_capacity')&&<Form.Item
                          label="Max Capacity"
                          name={[field.name,"max_capacity"]}
                          initialValue={30}
                        >
                          <InputNumber
                            onKeyUp={(event)=>localStorage.setItem(`${model.name}_edit_max_capacity_${index+1}`,event.target.value)}
                            defaultValue={30}
                            min={0}
                          />
                        </Form.Item>}
                        {model.extraField.includes('lecturer')&&<Form.Item
                          label="Lecturer"
                          name={[field.name,"lecturer"]}
                          rules={[
                              {
                                required: true,
                                message: `Please input a lecturer for ${model.name} group ${index+1}!`,
                              },
                            ]}
                          initialValue={localStorage.getItem(`${model.name}_lecturer_${index+1}`)}
                        >
                          <Select
                            onSelect={(event)=>{
                              localStorage.setItem(`${model.name}_edit_lecturer_${index+1}`,event)
                            }}
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                            initialValue={localStorage.getItem(`${model.name}_lecturer_${index+1}`)}
                          >
                            {additionalData.find(ad=>ad.target==='lecturer')?.data.map(l=>{
                              return l.status&&<Select.Option key={l.id} value={l.id}>
                                <Tooltip title={l.email}>
                                  {`${l.first_name}  ${l.last_name}`}
                                </Tooltip>
                              </Select.Option>
                            })
                            }
                          </Select>
                        </Form.Item>}
                        {model.extraField.includes('assistant')&&<Form.Item
                          label="Assistant"
                          name={[field.name,"assistant"]}
                          initialValue={localStorage.getItem(`${model.name}_assistant_${index+1}`)}
                        >
                          <Select
                            onSelect={(event)=>{
                              localStorage.setItem(`${model.name}_edit_assistant_${index+1}`,event)
                            }}
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                            initialValue={localStorage.getItem(`${model.name}_assistant_${index+1}`)}
                          >
                            {additionalData['assistant']!==undefined&&
                              additionalData.find(ad=>ad.target==='assistant').data.map(l=>{
                              return l.status&&<Select.Option key={l.id} value={l.id}>
                                <Tooltip title={l.studentId}>
                                  {`${l.first_name}  ${l.last_name}`}
                                </Tooltip>
                              </Select.Option>
                            })
                            }
                          </Select>
                        </Form.Item>}
                        {model.extraField.includes('activitytype')&&<Form.Item
                          label="Activity Type"
                          name={[field.name,"activitytype"]}
                          initialValue={localStorage.getItem(`${model.name}_activitytype_${index+1}`)}
                        >
                          <Select
                            onSelect={(event)=>{
                              localStorage.setItem(`${model.name}_edit_activitytype_${index+1}`,event)
                            }}
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                            initialValue={localStorage.getItem(`${model.name}_activitytype_${index+1}`)}
                            mode="multiple"
                          >
                            {
                              additionalData.find(ad=>ad.target==='activitytype').data.map(a=>{
                              return a.status&&<Select.Option key={a.id} value={a.id}>
                                <Tooltip title={a.description}>
                                  {`${a.name}`}
                                </Tooltip>
                              </Select.Option>
                            })
                            }
                          </Select>
                        </Form.Item>}
                        {model.extraField.includes('merged_with')&&<Form.Item
                          label="Merged with"
                          name={[field.name,"merged_with"]}
                          initialValue={localStorage.getItem(`${model.name}_merged_with_${index+1}`)}
                        >
                          <Select
                            onSelect={(event)=>{
                              localStorage.setItem(`${model.name}_edit_merged_with_${index+1}`,event)
                            }}
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                            initialValue={localStorage.getItem(`${model.name}_merged_with_${index+1}`)}
                            mode="multiple"
                          >
                            {
                              additionalData.find(ad=>ad.target==='coursegroup').data.map(a=>{
                              return a.status&&<Select.Option key={a.id} value={a.id}>
                                <Tooltip title={
                                  <div>
                                    <span>By {additionalData.find(d=>d.target==='lecturer')
                                    ?.data.find(c=>c.id===a.lecturer).email}</span>
                                    <Divider orientation="horizontal" style={{color:'whitesmoke'}}/>
                                    {a.is_elective&&<span>Is Elective</span>}
                                  </div>
                                }>
                                  {`${a.code} G${a.group_number}: ${a.name} Group ${a.group_number}`}
                                </Tooltip>
                              </Select.Option>
                            })
                            }
                          </Select>
                        </Form.Item>}
                        {model.extraField.includes('extra_session_of')&&<Form.Item
                          label="Extra Session "
                          name={[field.name,"extra_session_of"]}
                          initialValue={localStorage.getItem(`${model.name}_extra_session_of_${index+1}`)}
                        >
                          <Select
                            onSelect={(event)=>{
                              localStorage.setItem(`${model.name}_edit_extra_session_of_${index+1}`,event)
                            }}
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                            initialValue={localStorage.getItem(`${model.name}_extra_session_of_${index+1}`)}
                            mode="multiple"
                            maxTagCount={'resposive'}
                          >
                            {
                              additionalData.find(ad=>ad.target==='coursegroup').data.map(a=>{
                              return a.status&&<Select.Option key={a.id} value={a.id}>
                                <Tooltip title={
                                  <div>
                                    <span>By {additionalData.find(d=>d.target==='lecturer')
                                    ?.data.find(c=>c.id===a.lecturer).email}</span>
                                    <Divider orientation="horizontal" style={{color:'whitesmoke'}}/>
                                    {a.is_elective&&<span>Is Elective</span>}
                                  </div>
                                }>
                                  {`${a.code} G${a.group_number}: ${a.name} Group ${a.group_number}`}
                                </Tooltip>
                              </Select.Option>
                            })
                            }
                          </Select>
                        </Form.Item>}
                        {model.extraField.includes('prerequisites')&&<Form.Item
                          label="Prerequisite (s)"
                          name={[field.name,"prerequisites"]}
                          initialValue={localStorage.getItem(`${model.name}_prerequisites_${index+1}`)}
                        >
                          <Select
                            onSelect={(event)=>{
                              localStorage.setItem(`${model.name}_edit_prerequisites_${index+1}`,event)
                            }}
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                            initialValue={localStorage.getItem(`${model.name}_prerequisites_${index+1}`)}
                            mode="multiple"
                            maxTagCount={'resposive'}
                          >
                            {
                              additionalData.find(ad=>ad.target==='coursegroup').data.map(a=>{
                              return a.status&&<Select.Option key={a.id} value={a.id}>
                                <Tooltip title={
                                  <div>
                                    <span>By {additionalData.find(d=>d.target==='lecturer')
                                    ?.data.find(c=>c.id===a.lecturer).email}</span>
                                    <Divider orientation="horizontal" style={{color:'whitesmoke'}}/>
                                    {a.is_elective&&<span>Is Elective</span>}
                                  </div>
                                }>
                                  {`${a.code} G${a.group_number}: ${a.name} Group ${a.group_number}`}
                                </Tooltip>
                              </Select.Option>
                            })
                            }
                          </Select>
                        </Form.Item>}
                        {model.extraField.includes('course_semester')&&<Form.Item
                          label="Semester Program (s)"
                          name={[field.name,"course_semester"]}
                          initialValue={localStorage.getItem(`${model.name}_course_semester_${index+1}`)}
                        >
                          <Select
                            onSelect={(event)=>{
                              localStorage.setItem(`${model.name}_edit_course_semester_${index+1}`,event)
                            }}
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                            initialValue={localStorage.getItem(`${model.name}_course_semester_${index+1}`)}
                            mode="multiple"
                            maxTagCount={'resposive'}
                            rules={[
                              {
                                required: true,
                                message: `Please input a Course Semester for ${model.name} group ${index+1}!`,
                              },
                            ]}
                          >
                            {
                              additionalData.find(ad=>ad.target==='coursesemester').data.map(a=>{
                              return a.status&&<Select.Option key={a.id} value={a.id}>
                                <Tooltip title={'Craeted at '+a.created_at}>
                                  {`Semester ${a.semester_num} - ${additionalData.find(ad=>ad.target==='program')?.data.find(d=>d.id===a.program)?.shortname} - ${additionalData.find(ad=>ad.target==='semester')?.data.find(d=>d.id===a.semester)?.season} ${additionalData.find(ad=>ad.target==='semester')?.data.find(d=>d.id===a.semester)?.year}`}
                                </Tooltip>
                              </Select.Option>
                            })
                            }
                          </Select>
                        </Form.Item>}
                        {model.extraField.includes('status')&&
                          <Form.Item
                            name={[field.name,"status"]}
                            valuePropName="checked"
                            wrapperCol={{
                              offset: 8,
                              span: 16,
                            }}
                          >
                            <Checkbox>Enable</Checkbox>
                          </Form.Item>
                        }
                        {model.extraField.includes('is_elective')&&
                          <Form.Item
                            name={[field.name,"is_elective"]}
                            valuePropName="checked"
                            wrapperCol={{
                              offset: 8,
                              span: 16,
                            }}
                          >
                            <Checkbox>Is Elective</Checkbox>
                          </Form.Item>
                        }

                      </>)
                    })}
                   <Button type="dashed" onClick={() => add()} block style={{
                    maxWidth:'150px',
                    right:0
                   }}>
                      + Add a group
                    </Button>
                  </>
                   
                  )}
                  
          </Form.List>}
          {model.edit.includes('type')&&
                <Form.Item
                  label="Type"
                >
                  <Segmented
                  options={['Weekly','Daily']}
                  onChange={(value) => {
                    setTypeSElected(value)
                  }}
                  defaultValue="Weekly"
                />
                </Form.Item>
            }
            {model.edit.includes('day')&&typeSelected==='Weekly'&&
                <Form.Item
                  label="Select a day"
                  name={'day'}
                  rules={[
                    {
                      required: true,
                      message: `Need to select a day!`,
                    },
                  ]}
                  initialValue={rootStore.holosticScheduleContentStore.daysIndex.find(d=>id===data.day)?.name}
                >
                 <Segmented
                    options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']}

                  />
                </Form.Item>
            }
            {model.edit.includes('date')&&typeSelected==='Daily'&&
                <Form.Item
                name="date"
                label='Select a date'
                rules={[
                    {
                      required: true,
                      message: `Need to select a date!`,
                    },
                  ]}
                  initialValue={data.date?()=>{
                    setTypeSElected('Daily')
                    return dayjs(data.date,'YYYY-MM-DD')
                  }:()=>{}}
                >
                  <DatePicker/>
                </Form.Item>
            }
            {model.addFields.includes('start')&&
                <Form.Item
                name="start"
                label='Select a timerange'
                rules={[
                    {
                      required: true,
                      message: `Need to select a timerange!`,
                    },
                  ]}
                  initialValue={[data.start,data.end]}
            >
                <TimePicker.RangePicker  minuteStep={15} format={'HH:mm'} />
                </Form.Item>
            }
            {model.addFields.includes('coursegroup_s')&&
               <Form.Item
               name="coursegroup"
               label="Select the course"
               rules={[
                   {
                     required: true,
                     message: `Need to select at least one course!`,
                   },
                 ]}
               initialValue={data.coursegroup}
           >
               <Select
                 showSearch
                 placeholder={'Search for a course'}
                 defaultActiveFirstOption={false}
                 suffixIcon={null}
                 filterOption={false}
                 onSearch={onSearch}
                 notFoundContent={null}
                 options={(data1 || []).map((d) => ({
                   value: d.id,
                   label: d.code+ ' '+d.name,
                 }))}
               />
           </Form.Item>
            }
            {model.addFields.includes('room_s')&&
               <Form.Item
               name="room"
               label="Select the classroom"
               rules={[
                   {
                     required: true,
                     message: `Need to select at least one room!`,
                   },
                 ]}
               initialValue={data.room}
           >
               <Select
                 showSearch
                 placeholder={'Search for a room'}
                 defaultActiveFirstOption={false}
                 suffixIcon={null}
                 filterOption={false}
                 onSearch={onSearchRoom}
                 notFoundContent={null}
                 options={(dataRoom || []).map((d) => ({
                   value: d.id,
                   label: d.code,
                 }))}
               />
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
      </Form>}
      </>)
}
export default Edit;