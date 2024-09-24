import { useEffect } from "react";
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import rootStore from "../../../../mobx";

const Schedule = ({id,model})=>{

    useEffect(()=>{
        const getSchedule = ()=>{
            PrivateDefaultApi.post(`view_schedule/`,{
                id:id,
                model:model.content
            }).then((res)=>{
                console.log(res.data);
            }).error((error)=>{
                console.log(error);
                rootStore.notification.notify({
                    type:'error',
                    text:'Could load the requested timetable',
                    title:'Could load the requested timetable',
                    timeout:2500
                })
            })
        }
        getSchedule();
    },[id,model.name])

    return (
        null
    )
}
export default Schedule;