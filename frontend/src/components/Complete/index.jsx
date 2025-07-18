import { useEffect, useState } from "react";
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
import rootStore from "../../mobx";
import { generateTimeSlots, getDateData, getDayData, getDayString, ScheduleCell } from "../Content/HolisticSchedule/Content/AdditionalRendering";
import { useNavigate } from "react-router-dom";
import { Col, Row, Segmented, Slider, Space, Table, Tag } from "antd";

const CompleteSchedule = ()=>{
    const navigate = useNavigate()
    const [data,setData] = useState();
    const [timeSlots,setTimeSlots] = useState([0])
    const [tableData, setTableData] = useState([])
    const [timeInterval, settimeInterval] = useState(60)
    const [isDesktopViewType,setisDesktopViewType]  = useState(true)
    const [tableMobileData,settableMobileData] = useState([])
    const [mobileColumns,setMobileColumns] = useState()
    const [marks,setMarks] = useState()
    const [selectedScheduleType,setselectedScheduleType] = useState(3)
    const [scheduleType,setscheduleType] = useState([])
    const [columns, setColumns] = useState([]) 

    useEffect(()=>{
        const midtermDays = [
             '09-11-2024',
             '11-11-2024',
             '12-11-2024',
             '13-11-2024',
             '14-11-2024',
             '15-11-2024',
             '16-11-2024',
        ]
        if(selectedScheduleType===3){
            setColumns( [ {
                title:'TimeSlot',
                dataIndex: 'timeslot',
                key:'timeslot',
                style:{width:50}
            },
            ...midtermDays.map((m)=>(
                {
                title:m,
                dataIndex:matchMedia,
                key:m,
                render: (_,record) => <ScheduleCell record={record[m]}/>,
            }))])
        }else{
            setColumns( [ {
                title:'TimeSlot',
                dataIndex: 'timeslot',
                key:'timeslot',
                // width:'50px'
            },
            ...rootStore.holosticScheduleContentStore.daysIndex.map(({id,name, ...rest})=>(
                {
                title:name,
                dataIndex:id,
                key:id,
                render: (_,record) => <ScheduleCell record={record[name]}/>,
                rest
            }))])
        }
    },[selectedScheduleType])
    useEffect(()=>{
        setTimeSlots()
        const getMyData = async () =>{
            await PrivateDefaultApi.post(`view_schedule/`,{
                model:'complete',
                id:'none'
            }).then((res)=>{
                if(selectedScheduleType!==''){
                    const filteredData = res.data.filter(item=>item.type===selectedScheduleType)
                    setData(filteredData)
                }else{
                    setData(res.data);
                }
            }).catch((error)=>{
                console.log(error);
                rootStore.notification.notify({
                    type:'error',
                    text:'Could load the requested timetable',
                    title:'Could load the requested timetable',
                    timeout:2500
                })
            })
        }
        getMyData();
        setTimeSlots(generateTimeSlots('09:00:00','20:00:00',timeInterval))
    },[navigate,timeInterval,selectedScheduleType])
    useEffect(()=>{
        const getSchduleType = ()=>{
            PrivateDefaultApi.get('scheduletype/').then((res)=>{
                
                setscheduleType(res.data)
            })
        }
        getSchduleType()
    },[])
    useEffect(()=>{
        // For Desktop
        let newSh = [];
        timeSlots.map(timeSlot=>{
            const sc = selectedScheduleType!==3?{
                timeslot:`${timeSlot.start} - ${timeSlot.end}`,
                Monday:data?.filter(d=>(getDayData(timeSlot,1,d))),
                Tuesday:data?.filter(d=>(getDayData(timeSlot,2,d))),
                Wednesday:data?.filter(d=>(getDayData(timeSlot,3,d))),
                Thursday:data?.filter(d=>(getDayData(timeSlot,4,d))),
                Friday:data?.filter(d=>(getDayData(timeSlot,5,d))),
                Saturday:data?.filter(d=>(getDayData(timeSlot,6,d))),
            }:{
                timeslot:`${timeSlot.start} - ${timeSlot.end}`,
                '09-11-2024':data?.filter(d=>(getDateData(timeSlot,'09-11-2024',d))),
                '11-11-2024':data?.filter(d=>(getDateData(timeSlot,'11-11-2024',d))),
                '12-11-2024':data?.filter(d=>(getDateData(timeSlot,'12-11-2024',d))),
                '13-11-2024':data?.filter(d=>(getDateData(timeSlot,'13-11-2024',d))),
                '14-11-2024':data?.filter(d=>(getDateData(timeSlot,'14-11-2024',d))),
                '15-11-2024':data?.filter(d=>(getDateData(timeSlot,'15-11-2024',d))),
                '16-11-2024':data?.filter(d=>(getDateData(timeSlot,'16-11-2024',d))),
            }
            newSh = [...newSh.filter(n=>n.timeslot!==sc.timeslot),sc]
        })
        setTableData(newSh)
        // For Mobile
        let newSh2 = [];
        rootStore.holosticScheduleContentStore.daysIndex.map(d=>{
            const sc = {
                day:d.shortname,
            }
            timeSlots.map(t=>{
                sc[`${t.start} - ${t.end}`] = data?.filter(dt=>(getDayData(t,d.id,dt)))
            })
            newSh2 = [...newSh2.filter(n=>n.day!==sc.day),sc]
        })
        settableMobileData(newSh2)
    },[timeSlots,data,selectedScheduleType])
    useEffect(()=>{
        // For Desktop
        let newSh = [];
            timeSlots.map(timeSlot=>{
                const sc = {
                    timeslot:`${timeSlot.start} - ${timeSlot.end}`,
                    Monday:[],
                    Tuesday:[],
                    Wednesday:[],
                    Thursday:[],
                    Friday:[],
                    Saturday:[],
                }
                newSh = [...newSh.filter(n=>n.timeslot!==sc.timeslot),sc]
            })
            setTableData(newSh)
        //For Mobile
        let mobCol = [
            {
                title: 'Day',
                dataIndex: 'day',
                key: 'day',
                fixed:'left'
            },
        ]
        timeSlots.map(t=>{
            let timespanStrig = `${t.start} - ${t.end}`;
            if(t!==undefined)
            mobCol = [...mobCol.filter(m=>m.title!==timespanStrig),{
                title:<span
                    id={ `${t.start} - ${t.end}`}
                >
                    {`${t?.start?.split(':')[0]} - ${t?.end?.split(':')[0]}`}
                </span>,
                dataIndex:timespanStrig,
                key:timespanStrig,
            render: (_,record) => <ScheduleCell record={record[timespanStrig]}/>,
            }]
        })
        setMobileColumns(mobCol)

        let unit = 100/timeSlots.length
        let currUnit = unit
        let tempMarks ={
            0:{
                value:'09:00 - 10:00',
                label:'09:00',
            },
            33:{
                value:'12:00 - 13:00',
                label:'12:00',
            },
            66:{
                value:'14:00 - 15:00',
                label:'14:00',
            },
            100:{
                value:'17:00 - 18:00',
                label:'17:00',
            }
        }
        // timeSlots.map(t=>{
        //     let timespanStrig = `${t.start} - ${t.end}`
        //     tempMarks[currUnit] = {
        //         value: timespanStrig,
        //         label: `${t?.start?.split(':')[0]} - ${t?.end?.split(':')[0]}`
        //     }
        //     currUnit+=unit
        // })
        setMarks(tempMarks)
    },[timeSlots])

    // useEffect(()=>{
    //     if(rootStore.holisticScheduleStore.isPhone())
    //         setisDesktopViewType(false)
    // },[])

    const handleChageDisplay = (selected)=>{
        if(selected==='mobile')
            setisDesktopViewType(false)
        else
            setisDesktopViewType(true)

    }
    const handleSliderChange = (value)=>{
        // console.log('need to y scroll')
        const targetDiv = document.getElementById(marks[value].value);
        targetDiv.scrollIntoView({ behavior: 'smooth' })
    }
    const tooltipFormatter = (value) => {
        let toReturn = value;
        if(marks!==undefined&&marks[value]!==undefined)
          toReturn = marks[value]
        return toReturn.label // Customize the tooltip content here
  
    };

    return (<>
    {scheduleType.length>0&&<Row
            justify={'start'}
        >
            <Col span={12}>
            <Segmented
                options={
                    scheduleType
                }
                style={{
                    margin:'12px'
                }}
                onChange={(value)=>{
                    setselectedScheduleType(value)
                }}
                defaultValue={3}
            />
            </Col>

        </Row>}
        {rootStore.holisticScheduleStore.isPhone()&&
        <><Segmented
            onChange={handleChageDisplay}
            options={[
              {
                label: 'Mobile',
                value: 'mobile',
               //  icon: <BarsOutlined />,
              },
              {
                label: 'Desktop',
                value: 'desktop',
               //  icon: <AppstoreOutlined />,
              },
            ]}
            block
            style={{
                margin:'3px'
            }}
            defaultValue="desktop"
        /><br/>
         <center><Slider 
            step={null} 
            defaultValue={0} 
            style={{width:'90%'}}
            marks={marks}
            onChange={handleSliderChange}
            tooltip={{formatter:tooltipFormatter,}}

        /></center>
        </>}
        {timeSlots.length>0&&<> {
            isDesktopViewType?
            <Table 
             columns={columns} 
             dataSource={tableData}
             rowKey="timeslot"
             pagination={false}
             scroll={{ x: 1000 }}
             bordered 
         />:
            <Table
            className="mobile-schedule"
            columns={mobileColumns} 
            dataSource={tableMobileData} 
            pagination={false}
            bordered 
            scroll={{
                x: 'max-content',
                // y: 55 * 5,
              }}
          />
         }
         </>}
         </>
     )
}
export default CompleteSchedule;