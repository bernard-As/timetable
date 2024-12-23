import { Button, Col, Row, Table, Typography } from "antd";
import { observer } from "mobx-react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import analisysStore from "../../mobx/AnalisysStore";
import { AnalysisApi } from "../../utils/AxiosInstance";
import { useEffect, useState } from "react";
const General = observer(() => {
    const [data, setData] = useState();
    const [tableData, setTableData] = useState([]);
    const getGeneralData = async() => {
        const response = await AnalysisApi.post('default/');
        if(response.status===200){
            console.log(response.data);
            setData(response.data);
        }
    }
    useEffect(()=>{
        setTableData([{
            key: '1',
            obj: 'Instructors',
            cuurentValue: data?.lecturer,
            total: data?.total_lecturer,
          }, {
            key: '2',
            obj: 'Courses',
            cuurentValue: data?.coursegroup,
            total: data?.total_coursegroup,
          }, {
            key: '3',
            obj: 'Students',
            cuurentValue: data?.student,
            total: data?.total_student,
        },
        {
            key: '4',
            obj: 'Schedule',
            cuurentValue: data?.schedule,
            total: 'N/A',
        }
    ]);
    },[data])

    useEffect(()=>{
        getGeneralData();
    },[])
    const columns = [
        {
          title: '',
          dataIndex: 'obj',
          key: 'obj',
        },
        {
          title: 'Current Value',
          dataIndex: 'cuurentValue',
          key: 'cuurentValue',
        },
        {
          title: 'Total',
          dataIndex: 'total',
          key: 'total',
        },
      ];
    return (
        <div>
            <Row
                onClick={()=>{
                    analisysStore.selectAnalisysType(analisysStore.items[0]);
                }}
                style={{
                    cursor:'pointer',
                    maxHeight:25,
                    width:'100%',
                }}
            >
                {/* <Col span={5}
                style={{
                    cursor:'pointer',
                    maxHeight:25,
                }}
                >
                    {analisysStore.selectedAnalisysType!=='general'?
                        <FaArrowRight size={28}/>:
                        <FaArrowDown size={28}/>
                    }
                </Col> */}
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
                            icon={analisysStore.items[0].icon}
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
                            General
                        </h2>
                </Col>
                
            </Row>
            <br />
            {analisysStore.selectedAnalisysType==='general'&&<Table 
                columns={columns}
                dataSource={tableData}
                pagination={false}
            />}

        </div>
    );
})
export default General;