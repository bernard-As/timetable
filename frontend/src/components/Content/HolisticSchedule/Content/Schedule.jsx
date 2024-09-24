import { useEffect, useState } from "react";
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import rootStore from "../../../../mobx";
import { observer } from "mobx-react";
import { Table } from "antd";
import { ScheduleCell } from "./AdditionalRendering";
import dayjs from "dayjs";

const Schedule = observer(({id,model})=>{
    const [timeInterval, setTimeInterval] = useState(60); // Default 1 hour interval
    const [data,setData] = useState([])
    const [timeSlots,settimeSlots] = useState([])
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
    
    useEffect(()=>{
        const getSchedule = ()=>{
            PrivateDefaultApi.post(`view_schedule/`,{
                id:id,
                model:model.name
            }).then((res)=>{
                setData(res.data);
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
    },[id,model.name,timeInterval])

    useEffect(()=>{
        const compareTimeSlots = (timeSlot, courseStart, courseEnd)=>{
            const start = dayjs(courseStart, "HH:mm:ss").format("HH:mm");
            const end = dayjs(courseEnd, "HH:mm:ss").format("HH:mm");
            if(start<=timeSlot.start&&end>timeSlot.start)
                return true;
            // else if (timeSlot.start)
            // if(timeSlot===`${start - end}`)
            //     return true;
            return false;
        }
        const convertDateToDayOfWeekId = (date) => {

            const dayOfWeek = dayjs(date).format('dddd');
            return rootStore.holosticScheduleContentStore.daysIndex.find(d=>d.name===dayOfWeek)?.id
            return dayOfWeek;
          
          };
        
        const convertToData= ()=>{
            let newSh = [];
            timeSlots.map(timeSlot=>{
                    console.log(timeSlots)

                //Monday
                const sc = {
                    timeslot:`${timeSlot.start} - ${timeSlot.end}`,
                    Monday:data?.filter(d=>(d.day===1||convertDateToDayOfWeekId(d.date)===1)&&compareTimeSlots(timeSlot,d.start,d.end)),
                    Tuesday:data?.filter(d=>(d.day===2||convertDateToDayOfWeekId(d.date)===2)&&compareTimeSlots(timeSlot,d.start,d.end)),
                    Wednesday:data?.filter(d=>(d.day===3||convertDateToDayOfWeekId(d.date)===3)&&compareTimeSlots(timeSlot,d.start,d.end)),
                    Thursday:data?.filter(d=>(d.day===4||convertDateToDayOfWeekId(d.date)===4)&&compareTimeSlots(timeSlot,d.start,d.end)),
                    Friday:data?.filter(d=>(d.day===5||convertDateToDayOfWeekId(d.date)===5)&&compareTimeSlots(timeSlot,d.start,d.end)),
                    Saturday:data?.filter(d=>(d.day===6||convertDateToDayOfWeekId(d.date)===6)&&compareTimeSlots(timeSlot,d.start,d.end)),
                }
                newSh = [...newSh.filter(n=>n.timeslot!==sc.timeslot),sc]
                // newSh.push(sc)
            })
            setTableData(newSh)
        }
        convertToData()
    },[timeSlots])
    return (
        <Table 
            columns={columns} 
            dataSource={tableData}
            rowKey="timeslot"
            pagination={false}
            scroll={{ x: 1000 }}
            bordered 
        />
    )
})
export default Schedule;