import { useEffect, useState } from "react";
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import rootStore from "../../../../mobx";
import { observer } from "mobx-react";
import { Table } from "antd";
import { ScheduleCell } from "./AdditionalRendering";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

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
            timeSlots.map(timeSlot=>{
                const sc = {
                    timeslot:`${timeSlot.start} - ${timeSlot.end}`,
                    Monday:data?.filter(d=>(getDayData(timeSlot,1,d))),
                    Tuesday:data?.filter(d=>(getDayData(timeSlot,2,d))),
                    Wednesday:data?.filter(d=>(getDayData(timeSlot,3,d))),
                    Thursday:data?.filter(d=>(getDayData(timeSlot,4,d))),
                    Friday:data?.filter(d=>(getDayData(timeSlot,5,d))),
                    Saturday:data?.filter(d=>(getDayData(timeSlot,6,d))),
                }
                newSh = [...newSh.filter(n=>n.timeslot!==sc.timeslot),sc]
            })
            setTableData(newSh)
        }
        data.length>0&&convertToData()
    },[timeSlots,data])
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
    return (<>
       {timeSlots.length>0&& <Table 
            columns={columns} 
            dataSource={tableData}
            rowKey="timeslot"
            pagination={false}
            scroll={{ x: 1000 }}
            bordered 
        />}
        </>
    )
})
export default Schedule;