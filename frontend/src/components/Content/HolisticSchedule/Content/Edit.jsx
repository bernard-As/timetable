import { Button, Card, Checkbox, DatePicker, Divider, Form, Input, InputNumber, Segmented, Select, Space, Table, TimePicker, Tooltip } from "antd"
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import rootStore from "../../../../mobx";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { generateTimeSlots, getDayData, ScheduleCell } from "./AdditionalRendering";

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
  const [selectedCourseGroupM,setselectedCourseGroupM] = useState([])
  const [timeSlots,setTimeSlots] = useState([0])
  const [tableData, setTableData] = useState([])
  const columns = [ {
    title:'TimeSlot',
    dataIndex: 'timeslot',
    key:'timeslot'
},
...rootStore.holosticScheduleContentStore.daysIndex.map(({id,name, ...rest})=>(
    {
    title:name,
    dataIndex:id,
    key:id,
    render: (_,record) => <ScheduleCell record={record[name]}/>,
    rest
}))]
const [timeInterval, settimeInterval] = useState(60)
const [courseData,setCourseData] = useState([])

  useEffect(()=>{
        PrivateDefaultApi.get(`${model.apiUrl}/${id}/`).then((res)=>{
            setData(res.data)
            setselectedCourseGroupM(res.data.coursegroup)
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
      // fetchAdditional('assistant')
      fetchAdditional('activitytype')
      fetchAdditional('coursegroup')
      fetchAdditional('coursesemester')
    },[])
    useEffect(()=>{
      setadditionalData(rootStore.holosticScheduleContentStore.additionallyFetchedData)
    },[rootStore.holosticScheduleContentStore.additionallyFetchedData])
    useEffect(()=>{
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
        values['id'] = id
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
          setData(res.data)
          setadditionalData([...additionalData.filter(a=>a.target!=='coursegroup'),{
            target:'coursegroup',
            data:res.data
          }])
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
  useEffect(()=>{
    setTimeSlots(generateTimeSlots('09:00:00','20:00:00',timeInterval))
},[timeInterval])
useEffect(() => {
  const getItems = async () => {
    try {
      const responses = await Promise.all(
        selectedCourseGroupM.map((s) => 
          PrivateDefaultApi.post('view_schedule/', {
            model: 'course',
            id: s,
          })
        )
      );

      // Extract and concatenate all response data
      const toReturn = responses.map(res => res.data).flat(); // Flattening in case you have nested arrays
      setCourseData(toReturn);
      console.log(toReturn);
    } catch (err) {
      console.error(err);
    }
  };

  getItems();
}, [selectedCourseGroupM]);

    useEffect(()=>{
      let newSh = [];
        timeSlots.map(timeSlot=>{
            const sc = {
                timeslot:`${timeSlot.start} - ${timeSlot.end}`,
                Monday:courseData?.filter(d=>(getDayData(timeSlot,1,d))),
                Tuesday:courseData?.filter(d=>(getDayData(timeSlot,2,d))),
                Wednesday:courseData?.filter(d=>(getDayData(timeSlot,3,d))),
                Thursday:courseData?.filter(d=>(getDayData(timeSlot,4,d))),
                Friday:courseData?.filter(d=>(getDayData(timeSlot,5,d))),
                Saturday:courseData?.filter(d=>(getDayData(timeSlot,6,d))),
            }
            newSh = [...newSh.filter(n=>n.timeslot!==sc.timeslot),sc]
        })
      console.log('hi')
      setTableData(newSh)
    },[timeSlots,courseData])

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
            initialValues={data}
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
            { model.addFields.includes('studentId')&&
            <Form.Item
              name="studentId"
              label="Student Number"
              rules={[
                {
                  required: true,
                  message: 'Please input your Student Number!',
                },
              ]}
              initialValue={localStorage.getItem(`${model.name}_studentId`)}

            >
              <InputNumber
                onKeyUp={(event)=>localStorage.setItem(`${model.name}_studentId`,event.target.value)}
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
                    <InputNumber
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_floor_number`,event.target.value)}
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
                  initialValue={{value:data.faculty}}
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
                initialValue={{value:data.department}}
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
                  initialValue={{value:data.program}}
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
              model.addFields.includes('coursegroup_m')&&
              additionalData.find(ad=>ad.target==='coursegroup')&&
              <Form.Item
                label="Courses"
                name="coursegroup"
                rules={[
                    {
                      required: true,
                      message: `Please select the courses for ${model.name}!`,
                    },
                  ]}
                >
                    <Select
                    onSearch={onSearch}
                    // showSearch
                    // optionFilterProp="children"
                    // filterOption={(input, option) =>
                    //   option.children.toLowerCase().includes(input.toLowerCase())
                    // }
                    onChange={(event)=>{
                      console.log(event)
                      setselectedCourseGroupM(event)
                    }}
                      onSelect={(event)=>{
                        localStorage.setItem(`${model.name}_coursegroup_m`,event)
                      }}
                      maxTagCount={'resposive'}
                      mode="multiple"
                      allowClear
                      filterOption={false} 
                      // initialValue={localStorage.getItem(`${model.name}_coursegroup_m`)}
                    >
                      {additionalData.find(ad=>ad.target==='coursegroup').data.map(p=>{
                        return p.status&&
                        <Select.Option key={p.id} value={p.id}>{p.code} G{p.group_number} ~ {p.name}</Select.Option>
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
                    <InputNumber
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_capacity`,event.target.value)}
                      defaultValue={25}
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
                    <InputNumber
                      onKeyUp={(event)=>localStorage.setItem(`${model.name}_exm_capacity`,event.target.value)}
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
                          value:'OT',
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
            {model.extraField!==undefined&&<Form.List name="groups">
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
                              onKeyUp={(event)=>localStorage.setItem(`${model.name}_group_number_${index+1}`,event.target.value)}
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
                              onKeyUp={(event)=>localStorage.setItem(`${model.name}_duration_${index+1}`,event.target.value)}
                              defaultValue={2}
                            />
                          </Form.Item>}
                          {model.extraField.includes('max_capacity')&&<Form.Item
                            label="Max Capacity"
                            name={[field.name,"max_capacity"]}
                            initialValue={30}
                          >
                            <InputNumber
                              onKeyUp={(event)=>localStorage.setItem(`${model.name}_max_capacity_${index+1}`,event.target.value)}
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
                                localStorage.setItem(`${model.name}_lecturer_${index+1}`,event)
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
                                localStorage.setItem(`${model.name}_assistant_${index+1}`,event)
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
                                localStorage.setItem(`${model.name}_activitytype_${index+1}`,event)
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
                                localStorage.setItem(`${model.name}_merged_with_${index+1}`,event)
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
                                localStorage.setItem(`${model.name}_extra_session_of_${index+1}`,event)
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
                                localStorage.setItem(`${model.name}_prerequisites_${index+1}`,event)
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
                                localStorage.setItem(`${model.name}_course_semester_${index+1}`,event)
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
            {model.addFields.includes('type')&&
                <Form.Item
                  label="Type"
                >
                  <Segmented
                  options={['Weekly','Daily']}
                  onChange={(value) => {
                    setTypeSElected(value)
                  }}
                />
                </Form.Item>
            }
            {model.addFields.includes('day')&&typeSelected==='Weekly'&&
                <Form.Item
                  label="Select a day"
                  name={'day'}
                  rules={[
                    {
                      required: true,
                      message: `Need to select a day!`,
                    },
                  ]}
                >
                 <Segmented
                    options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']}
                  />
                </Form.Item>
            }
            {model.addFields.includes('date')&&typeSelected==='Daily'&&
                <Form.Item
                name="date"
                label='Select a date'
                rules={[
                    {
                      required: true,
                      message: `Need to select a date!`,
                    },
                  ]}
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
               initialValue={localStorage.getItem(`create_courseId`)}
           >
               <Select
                 showSearch
                 placeholder={'Search for a course'}
                 defaultActiveFirstOption={false}
                 suffixIcon={null}
                 filterOption={false}
                 onSearch={onSearch}
                 notFoundContent={null}
                 options={(data || []).map((d) => ({
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
               initialValue={localStorage.getItem(`create_courseId`)}
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
      {
              model.addFields.includes('coursesPreview')&&
              timeSlots.length>0&& <Table
                columns={columns} 
                dataSource={tableData}
                rowKey="timeslot"
                pagination={false}
                scroll={{ x: 1000 }}
                bordered 
            />
              
            }
      </>)
}
export default Edit;