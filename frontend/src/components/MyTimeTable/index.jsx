import { useEffect, useState } from "react";
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
import rootStore from "../../mobx";
import { generateTimeSlots, getDateData, getDayData, getDayString, ScheduleCell } from "../Content/HolisticSchedule/Content/AdditionalRendering";
import { useNavigate } from "react-router-dom";
import { Col, FloatButton, Row, Segmented, Slider, Space, Table, Tag, Typography } from "antd";
import { BsCalendar3Week } from "react-icons/bs";
import { MdOutlineLooks3, MdOutlineLooksOne, MdOutlineLooksTwo } from "react-icons/md";

const MyTimetable = ()=>{
    const navigate = useNavigate()
    const [data,setData] = useState();
    const [timeSlots,setTimeSlots] = useState([0])
    const [tableData, setTableData] = useState([])
    const [timeInterval, setTimeInterval] = useState(60)
    const [isDesktopViewType,setisDesktopViewType]  = useState(true)
    const [tableMobileData,settableMobileData] = useState([])
    const [mobileColumns,setMobileColumns] = useState()
    const [marks,setMarks] = useState()
    const [selectedScheduleType,setselectedScheduleType] = useState('All') //default 'All'
    const [scheduleType,setscheduleType] = useState([])
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
            start:10,
            end:14
        },
        week2:{
            start:16,
            end:21,
        },
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
                key:'timeslot',
                width:rootStore.holisticScheduleStore.isPhone()?'0px':'auto'
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
                const m = `${i}-06-2025`;
                week1Columns.push({
                    title:m,
                    dataIndex:m,
                    key:`week1_${i+1}`,
                    render: (_,record) => <ScheduleCell record={record[m]} currentDate={m}/>,
                    })
            }
            for(let i=finalDays.week2.start;i<=finalDays.week2.end;i++){
                const ini = i>9?'':'0'
                const m = `${ini}${i}-06-2025`;
                week2Columns.push({
                    title:m,
                    dataIndex:m,
                    key:`week2_${i+1}`,
                    render: (_,record) => <ScheduleCell record={record[m]} currentDate={m}/>,
                    })
            }
            // for(let i=finalDays.week3.start;i<=finalDays.week3.end;i++){
            //     const m = `${i}-06-2025`;
            //     week3Columns.push({
            //         title:m,
            //         dataIndex:m,
            //         key:`week3_${i+1}`,
            //         render: (_,record) => <ScheduleCell record={record[m]} currentDate={m}/>,
            //         })
            // }
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
                key:'timeslot',
                style:{width:'50px'}
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
            await PrivateDefaultApi.get('my_schedule/').then((res)=>{
                if(selectedScheduleType!==''&&selectedScheduleType!=='All'){
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
        let newSh11 = [];
        let newSh22 = [];
        let newSh33 = [];
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
                        const m = `${i}-06-2025`;
                    sc1[m] = data?.filter(d=>(getDateData(timeSlot,m,d)))
                }
                newSh11 = [...newSh11.filter(n=>n.timeslot!==sc1.timeslot),sc1]
                const sc2 = {timeslot:`${timeSlot.start} - ${timeSlot.end}`,}
                for(let i=finalDays.week2.start;i<=finalDays.week2.end;i++){
                    const ini = i>9?'':'0'
                        const m = `${ini}${i}-06-2025`;
                    sc2[m] = data?.filter(d=>(getDateData(timeSlot,m,d)))
                }
                newSh22 = [...newSh22.filter(n=>n.timeslot!==sc2.timeslot),sc2]
                const sc3 = {timeslot:`${timeSlot.start} - ${timeSlot.end}`,}
                // for(let i=finalDays.week3.start;i<=finalDays.week3.end;i++){
                //     const m = `${i}-06-2025`;
                //     sc3[m] = data?.filter(d=>(getDateData(timeSlot,m,d)))
                // }
                // newSh33 = [...newSh33.filter(n=>n.timeslot!==sc3.timeslot),sc3]


            }
        })
        setTableData(newSh)
        if (selectedScheduleType===5){
            setTableData1(newSh11)
            setTableData2(newSh22)
            setTableData3(newSh33)
            // console.log(newSh1);
            
        }
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
                    [{
                        label:'All',
                        value:'All'
                    },...scheduleType, ]
                }
                style={{
                    margin:'12px'
                }}
                onChange={(value)=>{
                    setselectedScheduleType(value)
                }}
                value={selectedScheduleType}
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
            selectedScheduleType!==5?<Table 
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
            {/* <center>
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
            />} */}

        </div>
         :
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
      {/* <FloatButton 
        icon={<MdOutlineLooks3 size={21}/>}
        onClick={() => {
            scrollToDiv('week3')
        }}
    /> */}
    </FloatButton.Group>

    }
         </>
     )
}
export default MyTimetable;