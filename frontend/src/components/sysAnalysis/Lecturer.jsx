import { Button, Col, Row, Table, Tabs, Tag, Tooltip, Typography } from "antd";
import { observer } from "mobx-react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import analisysStore from "../../mobx/AnalisysStore";
import { AnalysisApi } from "../../utils/AxiosInstance";
import { Children, useEffect, useState } from "react";
import { GrStatusWarning } from "react-icons/gr";
import { FcOk } from "react-icons/fc";
import { RxCrossCircled } from "react-icons/rx";
import { GrOverview } from "react-icons/gr";
import { CgDetailsLess } from "react-icons/cg";
import { render } from "react-dom";
const Lecturer = observer(() => {
    const [data, setData] = useState();
    const [tableData, setTableData] = useState([]);
    const getGeneralData = async() => {
        const response = await AnalysisApi.post('lecturer/');
        if(response.status===200){
            console.log(response.data);
            setData(response.data);
        }
    }
    const columns = [
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          render: (text,record) => <Tooltip title={record.name}>{text}</Tooltip>,
        },
        {
          title: 'Courses Exam',
          dataIndex: 'coursesExam',
          key: 'coursesExam',
        },
        {
          title: 'Other Invigilation(s)',
          dataIndex: 'invigilation',
          key: 'invigilation',
        },
        {
            title: 'Total Invigilation(s)',
            dataIndex: 'total_invigilation',
            key: 'total_invigilation',
          },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => (
            record.status?<Tag 
                color={record.status===0?'blue':
                    record.status===1?'green':
                    record.status===2?'orange':'red'}
                icon={record.status===0?<FcOk color="blue"/>:
                    record.status===1?<FcOk />:
                    record.status===2?<GrStatusWarning color="orange"/>:
                    <RxCrossCircled color="red"/>}
            />:'N/A'

                
        )
        },
        {
            title: 'More',
            dataIndex: 'more',
            key: 'more',
            render: (text, record) => (
                <Button
                    type="text"
                    icon={<FaArrowRight/>}
                />
            )
          },
      ];

    const tabsItems = [
        {
            key:'1',
            label:'Overview',
            icon:<GrOverview/>,
            children:<Table 
                columns={columns}
                dataSource={tableData}
                pagination={false}
            />
        },
        {
            key:'2',
            label:'Detail',
            icon:<CgDetailsLess/>,
            disabled:true
        },
    ]
    useEffect(()=>{
        const temp = [];
        data?.map((item,index)=>{
            temp.push({
                key:index,
                email:item.email,
                coursesExam:item.courseExam,
                invigilation:item.invigilation,
                total_invigilation:item.total_invigilation,
                status:item.status,
        })
    })
        setTableData(temp);
    },[data])

    useEffect(()=>{
        getGeneralData();
    },[])
    
    
    return (
        <div>
            <Row
                onClick={()=>{
                    analisysStore.selectAnalisysType(analisysStore.items[1]);
                }}
                style={{
                    cursor:'pointer',
                    maxHeight:25,
                    width:'100%',
                }}
            >
                    <Col span={25}
                    style={{
                        cursor:'pointer',
                        // maxHeight:25,
                        display:'inline-block',
                    }}
                    >
                        <Button
                            type="text"
                            style={{
                                maxHeight:25,
                                width:'auto',
                                display:'inline-block',
                            }}
                            ghost
                            icon={analisysStore.items[1].icon}
                            block
                        >
                            
                        </Button>
                        <h2
                            style={{
                                cursor:'pointer',
                                display:'inline-block',
                                marginLeft:10,
                                // maxHeight:25,
                            }}
                        >
                            {analisysStore.items[1].label}
                        </h2>
                </Col>
                
            </Row>
            <br />
            {analisysStore.selectedAnalisysType===analisysStore.items[1].key&&
            
            <Tabs defaultActiveKey="1"
                items={tabsItems}
            />
            }

        </div>
    );
})
export default Lecturer;