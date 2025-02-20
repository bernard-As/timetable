import { Button, Card, List, Modal, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import rootStore from "../../mobx";
import { useEffect, useState } from "react";
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
import Cookies from "js-cookie";
import { CourseTooltipRender } from "../Content/HolisticSchedule/Content/AdditionalRendering";

const UpComingLectures = ()=>{
    const [isLogin,setisLogin] = useState(false)
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItemToModal,setselectedItemToModal] = useState()
    const [locginCheck,setLoginCheck] = useState(false)
    const navigate = useNavigate();
    useEffect(()=>{
        const checkTokenValidity2 = async()=> {
          Cookies.get('token') !==null  &&
          await PrivateDefaultApi.post('verify_token').then((res)=>{

              if(res.status === 401){
                  setisLogin(false)
              }else{
                rootStore.credential = res.data.credential
                setisLogin(true)
              }
              setLoginCheck(true)
          }).catch((error)=>{
            setLoginCheck(true)
          })
        }
        checkTokenValidity2()

    },[navigate])
    useEffect(()=>{
        const getUpcomingLectures = () => {
            PrivateDefaultApi.get(isLogin?"my-upcoming-schedule/":"upcoming-schedule/")
              .then((res) => {
                setData(res.data.filter((d)=>d!=null));
              })
              .catch((error) => {
                console.log(error);
              });
          };
          if(locginCheck)
          getUpcomingLectures();
    },[isLogin,locginCheck])
    return (
        <Card
        title={`${isLogin?'My ':''} Next Lectures`}
        className="news-2"
        extra={[
            <Link to="/timetable" key="more">
                {isLogin&&<Button block>
                    My schedule <FiExternalLink size={20}/>
                </Button>}
            </Link>
        ]}
    >
        <List
            itemLayout="horizontal"
            dataSource={data}
            style={{
              overflowY: "auto",
              maxHeight: "320px",
            }}
            renderItem={(item, index) => {
              const courseCode = item.cg.code;
              return (
                <List.Item style={{ margin: "10px",cursor:'pointer' }}
                onClick={()=>{
                    setselectedItemToModal(item)
                    setShowModal(true)
                }}
                >
                  <List.Item.Meta
                    title={<span>Code: {courseCode} Room: {item.rm.code}</span>}
                    description={
                      <span>
                        Time Range: {item.start} ~ {item.end}{" "}
                        {item.day !== null
                          ? ` Day ${
                              rootStore.holosticScheduleContentStore.daysIndex.find(
                                (d) => d.id === item.day
                              )?.name
                            }`
                          : ` Date ${item.date}`}
                      </span>
                    }
                    action={[<Tag color="grey">{item.created_at}</Tag>]}
                  />
                    
                </List.Item>
              );
            }}
        />
        <Modal
            title="Lecture Details" 
            open={showModal} 
            onOk={()=>setShowModal(false)} 
            okText='Close'
            footer={
                <Button block onClick={()=>setShowModal(false)}>Close</Button>
            }
            onCancel={()=>setShowModal(false)}
        >
            <CourseTooltipRender data={selectedItemToModal} />
        </Modal>
    </Card>
        
    )
}
export default UpComingLectures;