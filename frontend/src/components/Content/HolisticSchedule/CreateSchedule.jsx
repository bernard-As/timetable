import { Button, DatePicker, Form, Input, Segmented, Select, TimePicker } from "antd";
import { PrivateDefaultApi } from "../../../utils/AxiosInstance";
import { observer } from "mobx-react";
import rootStore from "../../../mobx";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";

const CreateSchedule = ()=>{
  const [form] = Form.useForm();
  const [additionalData,setadditionalData] = useState([])
  const [typeSelected, setTypeSElected] = useState()
  const { Search } = Input;
  const [data,setData] = useState([])
  const [dataRoom,setDataRoom] = useState([])
  const onFinish = (values)=>{
    if(values.date!==undefined)values.date=values.date.format('YYYY-MM-DD')
    if(values.day!==undefined)values.day=rootStore.holosticScheduleContentStore.daysIndex.find(p=>p.name===values.day).id
    values.end =  values.start[1].format('HH:mm')
    values.start =  values.start[0].format('HH:mm')
    PrivateDefaultApi.post('schedule/',values).then((res)=>{
            console.log(res);
        }).catch((error)=>{
            console.error(error);
        })
    }
    const onFinishFailed = () =>{
        rootStore.notification.notify({
            type: 'error',
            title:'Failed Please Check the fields',
            text:'Failed Please Check the fields',
            timeout:1500
        })
    }
    const onSearch= (value)=>{
        PrivateDefaultApi.get('coursegroup/?search='+value).then((res)=>{
            setData(res.data)
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
    const fetchAdditional = (targetModel,id=null) =>{
        let url = targetModel+'/';
        if(id)
          url = url+id+'/'
        PrivateDefaultApi.get(url).then((res)=>{
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
    return(
        <>
            <Form
                name="schedule"
                onFinish={onFinish}
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
            >
                <Form.Item
                    label='Type'
                >
                <Segmented
                  options={['Weekly','Daily']}
                  onChange={(value) => {
                    setTypeSElected(value)
                  }}
                />
                </Form.Item>
                {
                    typeSelected==='Weekly'&&
                    <Form.Item
                        label='Select a day'
                    name="day"
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
                {
                    typeSelected==='Daily'&&
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
        </>
    )
}
export default observer(CreateSchedule);