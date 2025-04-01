import { useEffect, useState } from "react";
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import rootStore from "../../../../mobx";
import { observer } from "mobx-react";
import { Card, Col, FloatButton, Row, Segmented, Table, Tag, Typography } from "antd";
import { getDateData, ScheduleCell } from "./AdditionalRendering";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { BsCalendar3Week } from "react-icons/bs";
import { MdOutlineLooksOne,MdOutlineLooksTwo,MdOutlineLooks3 } from "react-icons/md";
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Schedule = observer(({id,model})=>{
    const [timeInterval, setTimeInterval] = useState(60); // Default 1 hour interval
    const [data,setData] = useState([])
    const [timeSlots,settimeSlots] = useState([])
    const [tableData, setTableData] = useState([])
    const [scheduleType,setscheduleType] = useState([])
    const [selectedScheduleType,setselectedScheduleType] = useState('')
    const [columns, setColumns] = useState([]) 
    const [columns1, setColumns1] = useState([]) 
    const [columns2, setColumns2] = useState([]) 
    const [columns3, setColumns3] = useState([]) 
    const [tableData1, setTableData1] = useState([])
    const [tableData2, setTableData2] = useState([])
    const [tableData3, setTableData3] = useState([])
    const [isMultiWeek,setisMultiWeek] = useState(false)
    const midtermDays = [
        '19-04-2025',
        '21-04-2025',
        '22-04-2025',
        '23-04-2025',
        '24-04-2025',
        '25-04-2025',
        '26-04-2025',
    ]
    const finalDays = {
        week1:{
            start:3,
            end:4
        },
        week2:{
            start:6,
            end:11,
        },
        week3:{
            start:13,
            end:18
        }
    }
    const scrollToDiv = (divID) => {

        const element = document.getElementById(divID);
    
        if (element) {
    
          element.scrollIntoView({ behavior: 'smooth' });
    
        }
    
      };
    useEffect(()=>{
        
        
        if(selectedScheduleType===3){
            setColumns( [ {
                title:'TimeSlot',
                dataIndex: 'timeslot',
                key:'timeslot'
            },
            ...midtermDays.map((m)=>(
                {
                title:m,
                dataIndex:matchMedia,
                key:m,
                render: (_,record) => <ScheduleCell record={record[m]}/>,
            }))])
        }else if(selectedScheduleType===5){
            setisMultiWeek(true)
            setTimeInterval(120)
            const week1Columns = []
            const week2Columns = []
            const week3Columns = []
            for(let i=finalDays.week1.start;i<=finalDays.week1.end;i++){
                const m = `0${i}-01-2025`;
                week1Columns.push({
                    title:m,
                    dataIndex:m,
                    key:`week1_${i+1}`,
                    render: (_,record) => <ScheduleCell record={record[m]} currentDate={m}/>,
                    })
            }
            for(let i=finalDays.week2.start;i<=finalDays.week2.end;i++){
                const ini = i>9?'':'0'
                const m = `${ini}${i}-01-2025`;
                week2Columns.push({
                    title:m,
                    dataIndex:m,
                    key:`week2_${i+1}`,
                    render: (_,record) => <ScheduleCell record={record[m]} currentDate={m}/>,
                    })
            }
            for(let i=finalDays.week3.start;i<=finalDays.week3.end;i++){
                const m = `${i}-01-2025`;
                week3Columns.push({
                    title:m,
                    dataIndex:m,
                    key:`week3_${i+1}`,
                    render: (_,record) => <ScheduleCell record={record[m]} currentDate={m}/>,
                    })
            }
            const defaultTimeslotCol = {
                title:'TimeSlot',
                dataIndex: 'timeslot',
                key:'timeslot'
            }
            setColumns1([ 
                defaultTimeslotCol,
                ...week1Columns
            ])
            setColumns2([
                defaultTimeslotCol,
                ...week2Columns
                ])
            setColumns3([
                defaultTimeslotCol,
                ...week3Columns
            ])    
                    
        }else{
            setColumns( [ {
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
            }))])
        }
    },[selectedScheduleType])
    
   
    
    useEffect(()=>{
        const getSchedule = ()=>{
            PrivateDefaultApi.post(`view_schedule/`,{
                id:id,
                model:model.name
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
        const generateTimeSlots = (start='09:00:00', end='20:00:00', interval) => {
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
          
            settimeSlots( slots);
          };
        
        const computeSchedule = ()=>{
            getSchedule();

            generateTimeSlots('09:00:00','20:00:00',timeInterval);

            
            // convertToData();
        }
        computeSchedule();
    },[id,model.name,timeInterval,selectedScheduleType,rootStore.holisticScheduleStore.schedule_created])
    
    useEffect(()=>{
        const compareTimeSlots = (timeSlot, courseStart, courseEnd) => {
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
          
        const convertDateToDayOfWeekId = (date) => {

            const dayOfWeek = dayjs(date).format('dddd');
            return rootStore.holosticScheduleContentStore.daysIndex.find(d=>d.name===dayOfWeek)?.id
          
          };
        const getDayData = (timeSlot,day,data)=>{
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
        const convertToData= ()=>{
            let newSh = [];
            let newSh1 = [];
            let newSh2 = [];
            let newSh3 = [];
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
                    ...midtermDays.reduce((acc, m) => {
                        acc[m] = data?.filter(d => getDateData(timeSlot, m, d));
                        return acc;
                    }, {})
                }
                newSh = [...newSh.filter(n=>n.timeslot!==sc.timeslot),sc]

                if (selectedScheduleType===5){
                    const sc1 = {timeslot:`${timeSlot.start} - ${timeSlot.end}`,}
                    for(let i=finalDays.week1.start;i<=finalDays.week1.end;i++){
                        const m = `0${i}-01-2025`;
                        sc1[m] = data?.filter(d=>(getDateData(timeSlot,m,d)))
                    }
                    newSh1 = [...newSh1.filter(n=>n.timeslot!==sc1.timeslot),sc1]
                    const sc2 = {timeslot:`${timeSlot.start} - ${timeSlot.end}`,}
                    for(let i=finalDays.week2.start;i<=finalDays.week2.end;i++){
                        const ini = i>9?'':'0'
                        const m = `${ini}${i}-01-2025`;
                        sc2[m] = data?.filter(d=>(getDateData(timeSlot,m,d)))
                    }
                    newSh2 = [...newSh2.filter(n=>n.timeslot!==sc2.timeslot),sc2]
                    const sc3 = {timeslot:`${timeSlot.start} - ${timeSlot.end}`,}
                    for(let i=finalDays.week3.start;i<=finalDays.week3.end;i++){
                        const m = `${i}-01-2025`;
                        sc3[m] = data?.filter(d=>(getDateData(timeSlot,m,d)))
                    }
                    newSh3 = [...newSh3.filter(n=>n.timeslot!==sc3.timeslot),sc3]


                }
            })
            setTableData(newSh)
            if (selectedScheduleType===5){
                setTableData1(newSh1)
                setTableData2(newSh2)
                setTableData3(newSh3)
                console.log(newSh1);
                
            }

        }
        data.length>0&&convertToData()
    },[timeSlots,data,selectedScheduleType])

    useEffect(()=>{
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
    },[timeSlots])

    useEffect(()=>{
        const getSchduleType = ()=>{
            PrivateDefaultApi.get('scheduletype/').then((res)=>{
                
                setscheduleType(res.data)
            })
        }
        getSchduleType()
    },[])
    return (<>
        <Row
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
                    
            />
            </Col>

        </Row>
        {selectedScheduleType!==5?
        timeSlots.length>0&& <Table 
            columns={columns} 
            dataSource={tableData}
            rowKey="timeslot"
            pagination={false}
            scroll={{ x: 1000 }}
            bordered 
        />:
        <div>
            <center>
            <Tag color="white" style={{
                    marginBottom:'10px'
                }}>
                    <Typography.Title level={3} id="week1">
                        Week1
                    </Typography.Title>
                </Tag>
            </center>
            {timeSlots.length>0&&  <Table 
                columns={columns1} 
                dataSource={tableData1}
                rowKey="timeslot"
                pagination={false}
                scroll={{ x: 1000 }}
                bordered 
            />}
            <center>
            <Tag color="white" style={{
                    marginBottom:'10px',
                    marginTop:'10px',
                }}>
                    <Typography.Title level={3} id="week2">
                        Week2
                    </Typography.Title>
                </Tag>
            </center>
            
            {timeSlots.length>0&&  <Table 
                columns={columns2} 
                dataSource={tableData2}
                rowKey="timeslot"
                pagination={false}
                scroll={{ x: 1000 }}
                bordered 
            />}
            <center>
                <Tag color="white" style={{
                    marginBottom:'10px',
                    marginTop:'10px',
                }}>
                    <Typography.Title level={3} id="week3">
                        Week3
                    </Typography.Title>
                </Tag>
            </center>
            {timeSlots.length>0&&  <Table 
                columns={columns3} 
                dataSource={tableData3}
                rowKey="timeslot"
                pagination={false}
                scroll={{ x: 1000 }}
                bordered 
            />}

        </div>
    }
    {selectedScheduleType===5&&
    <FloatButton.Group
      trigger="click"
      type="primary"
      style={{
        insetInlineEnd: 50,
      }}
      icon={<BsCalendar3Week />}
    >
      <FloatButton 
        icon={<MdOutlineLooksOne size={21}/>}
        onClick={() => {
            scrollToDiv('week1')
        }}
    />
      <FloatButton 
        icon={<MdOutlineLooksTwo size={21}/>}
        onClick={() => {
            scrollToDiv('week2')
        }}
    />
      <FloatButton 
        icon={<MdOutlineLooks3 size={21}/>}
        onClick={() => {
            scrollToDiv('week3')
        }}
    />
    </FloatButton.Group>

    }
       
        </>
    )
})
export default Schedule;