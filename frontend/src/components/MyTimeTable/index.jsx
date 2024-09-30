import { useEffect, useState } from "react";
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
import rootStore from "../../mobx";
import { generateTimeSlots, getDayData, ScheduleCell } from "../Content/HolisticSchedule/Content/AdditionalRendering";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";

const MyTimetable = ()=>{
    const navigate = useNavigate()
    const [data,setData] = useState();
    const [timeSlots,setTimeSlots] = useState([0])
    const [tableData, setTableData] = useState([])
    const [timeInterval, settimeInterval] = useState(60)
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
        setTimeSlots()
        const getMyData = async () =>{
            await PrivateDefaultApi.get('my_schedule/').then((res)=>{
                setData(res.data)
            }).catch((error)=>{
                console.log(error);
            })
        }
        getMyData();
        setTimeSlots(generateTimeSlots('09:00:00','20:00:00',timeInterval))
    },[navigate,timeInterval])

    useEffect(()=>{
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
}
export default MyTimetable;