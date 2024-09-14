import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import rootStore from "../../../mobx";
import HolisticSchedule404 from "./HolisticSchedule404";
import { Layout, Spin } from "antd";
import RduLoading from "../../../utils/RduLoading";
import HHeader from "./HHeader";
import HContent from "./HContennt";

const HolisticScheduleD:React.FC=()=>{
    const navigate = useNavigate();
    const location = useLocation();
    const [canDisplay,setCanDisplay] = useState(false)
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        setCanDisplay(rootStore.holisticScheduleStore.checkDisplayAvailability(location))
        return(
            () => {
            }
        )
    },[navigate])

    return (
        <>
            {
                !canDisplay ? <HolisticSchedule404/> : 
                
                <Layout style={{backgroundColor:'transparent'}}>
                    <HHeader/>
                    <HContent stopLoadingf = {setLoading}/> 
                </Layout>
            }
        </>
    )
}
export default HolisticScheduleD;