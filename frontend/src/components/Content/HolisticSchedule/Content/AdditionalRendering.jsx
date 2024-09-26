import { Divider, Modal, Spin, Tooltip } from "antd"
import { useEffect, useState } from "react"
import Add from "./Add"
import rootStore from "../../../../mobx"
import { FiPlus } from "react-icons/fi";
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";

export const ScheduleCell = ({record})=>{
    const [loaded,setLoaded] = useState(false)
    const [showSetScheduleModal,setshowSetScheduleModal]  =useState(false)
    const [isRecord,setIsRecord] = useState(false)
    const [showAdd,setshowAdd]  = useState(false)

    
    useEffect(()=>{
        setLoaded(true)
        if(record.length>0)
            setIsRecord(true)
    },[record])

    return (
        <>        
        {
            loaded?
            <div
                
                onMouseOver={()=>{
                    setshowAdd(true)
                }}
                onMouseOut={()=>{
                    setshowAdd(false)

                }}
                style={{minHeight:'20px', minWidth:'15px'}}
            >
                {record.map(r=>{
                    
                    return (
                        <CourseDisplayInCell cId={r.coursegroup} rId={r.room} start={r.start} end={r.end}/>
                    )
                })

                }
                {!isRecord&&
                    <span
                    onClick={()=>{
                        setshowSetScheduleModal(true)
                    }}
                    >
                        {showAdd&&<FiPlus size={25}/>}
                    </span>

                }
            </div>:
            '...'
            }
            <Modal title="Basic Modal" open={showSetScheduleModal} footer={null}
                onCancel={()=>setshowSetScheduleModal(false)}
            >
              <Add model={rootStore.holosticScheduleContentStore.content.find(c=>c.name==='create_schedule')}/>
            </Modal>
        </>

    )
}

export const CourseDisplayInCell = ({cId,rId,start,end})=>{
    const [courseData,setcourseData] = useState();
    const [roomData,setroomData] = useState()
    useEffect(()=>{
        const getDeatils = (id)=>{
            PrivateDefaultApi.get('coursegroup/'+cId+'/').then(res=>{
                setcourseData(res.data)
            }).catch(error=>{
                // console.log(error)
            })
            PrivateDefaultApi.get('room/'+rId+'/').then(res=>{
                setroomData(res.data)
            }).catch(error=>{
                // console.log(error)
            })
        }
        getDeatils()
    },[cId,rId])
    return (
        <>{courseData!==undefined&&roomData!==undefined&&
            <Tooltip title={courseData.code}>
            <span>
                {`${courseData.name} G${courseData.group_number} ~Room: ${roomData.code}`}
                <Divider/>
            </span>
        </Tooltip>
        }
        </>
        
    )
}