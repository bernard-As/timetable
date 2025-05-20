import { Divider, Modal, Popconfirm, Space, Spin, Tag, Tooltip } from "antd"
import React, { useEffect, useState } from "react"
import Add from "./Add"
import rootStore from "../../../../mobx"
import { FiPlus } from "react-icons/fi";
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FcInfo } from "react-icons/fc";
import dayjs from "dayjs";
export const LecturerDisplay = ({ id, getAdditional }) => {
    const [lecturer, setLecturer] = useState(undefined);
  
    useEffect(() => {
      const fetchLecturer = async () => {
        const lect = await getAdditional('lecturer', id);  // Await the result
        if (lect) {
          setLecturer(lect);  // Set the lecturer state when data is retrieved
        }
      };
      fetchLecturer();  // Call the async function
    }, [id, getAdditional]);  // Run the effect when id or getAdditional changes
  
    return (
      <span>
        {lecturer ? lecturer.email : 'Loading...'}
      </span>
    );
  };

export const RoomCodeDipslay = ({id})=>{
    const [roomData, setRoomData] = useState();
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        PrivateDefaultApi.get('room/'+id+'/').then((res)=>{
            setRoomData(res.data);
            setLoading(false)
        }).catch(error=>{
            console.log(error);
        })
    },[id])
    return (<>
        {loading?
        <Spin spinning={loading} size="large"/>
        :
        <span>{roomData!==undefined&&roomData.code}</span>

        }
    </>

    )
}

export const CourseGroupDipslay = ({id})=>{
    const [data, setData] = useState();
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        PrivateDefaultApi.get('coursegroup/'+id+'/').then((res)=>{
            setData(res.data);
            console.log(res.data)
            setLoading(false)
        }).catch(error=>{
            console.log(error);
        })
    },[id])
    return (<>
        {loading?
        <Spin spinning={loading} size="large"/>
        :
        <span>{data!==undefined&&
            <span>
                {data.code} - G{data.group_number}
            </span>
        }</span>

        }
    </>

    )
}
export const ScheduleCell = React.memo(({record,currentDate=null})=>{
    const [loaded,setLoaded] = useState(false)
    const [showSetScheduleModal,setshowSetScheduleModal]  =useState(false)
    const [isRecord,setIsRecord] = useState(false)
    const [showAdd,setshowAdd]  = useState(false)
    
    useEffect(()=>{
        setLoaded(true)
        
        if(record===undefined||record?.length>0)
            setIsRecord(false)
    },[record])
    useEffect(()=>{
        if(record!==undefined){
        // rootStore.holisticScheduleStore.add_schedule_holder.room = record.room
        // rootStore.holisticScheduleStore.add_schedule_holder.type = 'Daily'
        rootStore.holisticScheduleStore.add_schedule_holder.room = record[0]?.rm.id
        // rootStore.holisticScheduleStore.add_schedule_holder.assignmentType = 'Final Make-up Exam'
        // rootStore.holisticScheduleStore.add_schedule_holder.date = dayjs(currentDate,'DD-MM-YYYY').format('YYYY-MM-DD')
        // rootStore.holisticScheduleStore.add_schedule_holder.start = [
        //     dayjs(record.start, 'HH:mm:ss'),
        //     dayjs(record.start, 'HH:mm:ss'),
        //     // dayjs(record.start, 'HH:mm:ss').add(2,'hour'),
        // ]
        }
    },[showSetScheduleModal])
    return (
        <>        
        {
            loaded?
            <div
                className="cellDisplayer"
                // onMouseOver={()=>{
                //     setshowAdd(true)
                // }}
                // onMouseOut={()=>{
                //     setshowAdd(false)

                // }}
                style={{minHeight:'20px', minWidth:'15px'}}
            >
                {record?.map(r=>{
                    
                    return (<>
                        <CourseDisplayInCell data={r}
                        setshowSetScheduleModal={setshowSetScheduleModal}
                        setIsRecord={setIsRecord}
                        />
                        </>
                    )
                })

                }
                {!isRecord&&rootStore.enableManagement&&rootStore.isManager()&&
                    <span
                        onClick={()=>{
                            setshowSetScheduleModal(true)
                        }}
                        className="newAddPlus"
                    >
                        <FiPlus size={25}/>
                    </span>

                }
            </div>:
            '...'
            }
            <Modal title="Create Schedule" open={showSetScheduleModal} footer={null}
                onCancel={()=>setshowSetScheduleModal(false)}
            >
              <Add model={rootStore.holosticScheduleContentStore.content.find(c=>c.name==='create_schedule')}/>
            </Modal>
        </>

    )
})

export const  CourseDisplayInCell = ({data,setshowSetScheduleModal,setIsRecord})=>{
    const color = data.color!==undefined?data.color:rootStore.holisticScheduleStore.getDesignedColor(data.type);
    useEffect(()=>{
        if(data.cg===undefined&&data.rm===undefined){
            setIsRecord(false)
        }
    },[])
    return (
        <>{(data.cg!==undefined&&data.rm!==undefined)?
            <Popconfirm
                title={null}
                description={<CourseTooltipRender data={data} setshowSetScheduleModal={setshowSetScheduleModal}/>}
                footer={null}
                icon={<FcInfo size={25}/>}
                showCancel={false}
            >
            {rootStore.holisticScheduleStore.isPhone()!==true?
                <Tooltip title={<span>{data.cg.name}<br/>
                To view more details click
            </span>}>
            <span
                className="single-cell"
                style={{backgroundColor:color}}
            >
                {`${data.cg.code} G${data.cg.group_number} ~Room: ${data.rm.code}`}
                {data.type===5&&rootStore.enableManagement&&rootStore.isManager()&&data.invigilator!==null&&<span>{' '+data.invigilator}</span>}
                {/* <Divider style={{padding:0}}/> */}
            </span>
            </Tooltip>:
            <span
            className="single-cell"
                style={{backgroundColor:color}}
                >
            {`${data.cg.code} G${data.cg.group_number} ~Room: ${data.rm.code}`}
        
            {data.type===5&&rootStore.enableManagement&&rootStore.isLecturer()&&data.invigilator!==null?<span> {' '+data.invigilator}</span>:<span>{data.lecturer||' '}</span>}
        </span>
            }
        </Popconfirm>:
        <span
            onClick={()=>{
                setshowSetScheduleModal(true)
            }}
            className="newAddPlus"
        >
            <FiPlus size={25}/>
        </span>
        }
        <br />
        </>
        
    )
}
export const generateTimeSlots = (start='09:00:00', end='20:00:00', interval) => {
    const startTime = dayjs(start, "HH:mm:ss");
    const endTime = dayjs(end, "HH:mm:ss");
    const slots = [];
  
    let currentTime = startTime;
    while (currentTime.isBefore(endTime)) {
      const nextTime = currentTime.add(interval, 'minute');
    //   slots.push(`${currentTime.format("HH:mm")} - ${nextTime.format("HH:mm")}`);
    slots.push({start:currentTime.format("HH:mm"),end:nextTime.format("HH:mm")})
      currentTime = nextTime;
    }
  
    return slots
  };

  export const compareTimeSlots = (timeSlot, courseStart, courseEnd) => {
    const slotStartTime = dayjs(timeSlot.start, 'HH:mm');
    const slotEndTime = dayjs(timeSlot.end, 'HH:mm'); // corrected to timeSlot.end
    const dataStartTime = dayjs(courseStart, 'HH:mm:ss');
    const dataEndTime = dayjs(courseEnd, 'HH:mm:ss');
  
    // Check if the slot is exactly the same as the course time
    if (slotStartTime.isSame(dataStartTime) && slotEndTime.isSame(dataEndTime)) {
      return true;
    }
  
    // Check if the slot overlaps or fits within the course time
    const overlaps =
      (slotStartTime.isBetween(dataStartTime, dataEndTime, null, '[)') || 
       slotStartTime.isSameOrAfter(dataStartTime)) &&
      (slotEndTime.isBetween(dataStartTime, dataEndTime, null, '(]') || 
       slotEndTime.isSameOrBefore(dataEndTime));
    // overlaps&&console.log(overlaps)
    return overlaps;
  };
  
export const convertDateToDayOfWeekId = (date) => {

    const dayOfWeek = dayjs(date).format('dddd');
    return rootStore.holosticScheduleContentStore.daysIndex.find(d=>d.name===dayOfWeek)?.id
  
  };
export const getDayData = (timeSlot,day,data)=>{
    let isDay = false
    if(data.day!==(null||undefined)&&day===data.day)
        isDay = true
    else if(data.date!==(null||undefined)&&day===convertDateToDayOfWeekId(data.date))
        isDay = true
    if(!isDay)
        return false
    else if(compareTimeSlots(timeSlot,data.start,data.end))
        return true
    return false
}
export const getDateData = (timeSlot,date,data)=>{
    let isDay = false
    if(data.date!==(null||undefined)&&date===dayjs(data.date).format('DD-MM-YYYY'))
        isDay = true

    console.log(date);
    
    if(!isDay)
        return false
    else if(compareTimeSlots(timeSlot,data.start,data.end))
        return true
    return false
}
export const getDayString = (data)=>{
    if(data.day!==undefined){
        return rootStore.holosticScheduleContentStore.daysIndex.find(d=>d.id===data.day)
    }else if(data.date!==undefined){
    const dayOfWeek = dayjs(data.date).format('dddd');
    return rootStore.holosticScheduleContentStore.daysIndex.find(d=>d.name===dayOfWeek)
    }
}
export const RenderTableViewDapartment = ({id})=>{
    const [data, setData] = useState();
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        PrivateDefaultApi.get('department/'+id+'/').then((res)=>{
            setData(res.data);
        }).catch(error=>{
            console.log(error);
        })
    },[id])
    useEffect(()=>{
        setLoading(false)
    },[data])
    return (<>
        {loading?
        <Spin spinning={loading} size="medium"/>
        :
        <span>{data!==undefined&&data.name}</span>

        }
    </>

    )
}

export const RenderTableViewFaculty = ({id})=>{
    const [data, setData] = useState();
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        PrivateDefaultApi.get('faculty/'+id+'/').then((res)=>{
            setData(res.data);
        }).catch(error=>{
            console.log(error);
        })
    },[id])
    useEffect(()=>{
        setLoading(false)
    },[data])
    return (<>
        {loading?
        <Spin spinning={loading} size="medium"/>
        :
        <span>{data!==undefined&&data.name}</span>

        }
    </>

    )
}
export const RenderTableViewProgram = ({id})=>{
    const [data, setData] = useState();
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        PrivateDefaultApi.get('program/'+id+'/').then((res)=>{
            setData(res.data);
        }).catch(error=>{
            console.log(error);
        })
    },[id])
    useEffect(()=>{
        setLoading(false)
    },[data])
    return (<>
        {loading?
        <Spin spinning={loading} size="medium"/>
        :
        <span>{data!==undefined&&data.name}</span>

        }
    </>

    )
}
export const RenderTableViewCourses = ({coursegroups})=>{
    const [data, setData] = useState();
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        setLoading(false)
    },[])
    return (<>
        {loading?
        <Spin spinning={loading} size="medium"/>
        :
        <span>{coursegroups!==undefined&&
            coursegroups.map(d=>{
                return (
                    <span
                        key={d.id}
                    >
                        <Tag>
                            {d.code} G{d.group_number}
                        </Tag>
                    </span>
                )
            })
        }</span>

        }
    </>

    )
}
export const RenderTableViewSemester = ({id})=>{
    const [data, setData] = useState();
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        PrivateDefaultApi.get('semester/'+id+'/').then((res)=>{
            setData(res.data);
        }).catch(error=>{
            console.log(error);
        })
    },[id])
    useEffect(()=>{
        setLoading(false)
    },[data])
    return (<>
        {loading?
        <Spin spinning={loading} size="medium"/>
        :
    <span>{data!==undefined&&`${data.season} - ${data.year}`}</span>

        }
    </>

    )
}
export const CourseTooltipRender = ({data,setshowSetScheduleModal=()=>{}})=>{
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        setLoading(false)
    },[data])
    const deleteConfirm = (e) => {
        PrivateDefaultApi.delete('schedule/'+data.id+'/').then((res)=>{
            rootStore.notification.notify({
                type:'success',
                text:'Course deleted successfully',
                title:'Course deleted successfully',
                timeout: 3000
            })
            rootStore.holosticScheduleContentStore.refreshSchedule = true
            rootStore.holisticScheduleStore.schedule_created +=1
        })
      };
    return(
        <>{loading?<Spin/>:
            <div>
           {data!==undefined&& 
           <div>
           <Space
                direction="horizontal"
            >
                Day: {data.day!==(undefined||null)?`${rootStore.holosticScheduleContentStore.daysIndex.find(d=>d.id===data.day)?.name}`:
                    data.date
                }
            </Space><br/>
            <Space
                direction="horizontal"
            >
                Start: {data.start} - End {data.end}
            </Space><br/>
            <Space
                direction="horizontal"
            >
                <div>Name: {data.cg.name}</div>
            </Space><br/>
            <Space
                direction="horizontal"
            >
                <div>Code: {data.cg.code} G{data.cg.group_number}</div>
            </Space><br/>
            <Space
                direction="horizontal"
            >
                <div>Type: <Tag color={rootStore.holisticScheduleStore.getDesignedColor(data.type)}>{data.tp.name}</Tag></div>
            </Space><br/>
            <Space
                direction="horizontal"
            >
                <div>Room: {data.rm.code} - Floor: {data.rm.floor_num} - Building: {data.rm.building} </div>
            </Space><br/>
            <Space
                direction="horizontal"
            >
                <div>Lecturer: {data.lect.title} {data.lect.first_name} {data.lect.last_name}</div>
            </Space><br/>
            {data.type===2&&data.assit!==undefined&&
                <><Space
                direction="horizontal"
            >
                <div>Assistant: {data.assit.title} {data.assit.first_name} {data.assit.last_name}</div>
            </Space><br/></>}
            {data.type===3&&data.invigilator!==undefined&&rootStore.isLecturer()&&
                <><Space
                direction="horizontal"
            >
                <div>Invigilator: {data.invigilator}</div>
            </Space><br/></>}
            {rootStore.enableManagement&&rootStore.isManager()&&<Space.Compact
                    direction="horizontal"
                    align="end"
                >
                    <Popconfirm
                        title='Are you sure to delete this schedle'
                        okText="Yes"
                        cancelText="No"
                        onConfirm={deleteConfirm}
                    >
                        <MdDeleteForever size={23} style={{margin:'7px'}} color="red"/>

                    </Popconfirm>
                    {/* <MdEdit size={23} style={{margin:'7px'}} color="blue"/> */}
                    <Tooltip
                        title="Add a new Schedule"
                    >
                        <AiOutlinePlus size={23} style={{margin:'7px'}} color="green"
                            onClick={()=>{
                                setshowSetScheduleModal(true)
                            }}
                        />
                    </Tooltip>
                </Space.Compact>}
            </div>}
            
            {data===undefined&&<div>
                ...    
            </div>}
        </div>
        }
        
        </>
        
    )
}