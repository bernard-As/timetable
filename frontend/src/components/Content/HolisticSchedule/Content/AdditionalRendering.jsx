import { Modal, Spin } from "antd"
import { useEffect, useState } from "react"
import Add from "./Add"
import rootStore from "../../../../mobx"

export const ScheduleCell = ({record})=>{
    const [loaded,setLoaded] = useState(false)
    const [showSetScheduleModal,setshowSetScheduleModal]  =useState(false)
    useEffect(()=>{
        setLoaded(true)
        console.log(record)
    },[])
    return (
        <>        
        {
            loaded?
            <div
                onClick={()=>{
                    setshowSetScheduleModal(true)
                }}
            >
                {
                    record.timeslot
                }
                ececrcec
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