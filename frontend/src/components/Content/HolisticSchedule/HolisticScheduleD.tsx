import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import rootStore from "../../../mobx";
import HolisticSchedule404 from "./HolisticSchedule404";
import { Layout, Spin } from "antd";
import RduLoading from "../../../utils/RduLoading";
import HHeader from "./HHeader";
import HContent from "./HContent";

const HolisticScheduleD:React.FC=()=>{
    const navigate = useNavigate();
    const location = useLocation();
    const [canDisplay,setCanDisplay] = useState(false)
    const [loading,setLoading] = useState(true)
    const [toDisplay,setToDisplay] = useState<any>('list')
    const [searchData, setsearchData] = useState(null)

    useEffect(()=>{
        setToDisplay('list')
        setCanDisplay(rootStore.holisticScheduleStore.checkDisplayAvailability(location))
        return(
            () => {
            }
        )
    },[navigate])
    

    return (
        <>
            {
                // !canDisplay ? <HolisticSchedule404/> : 
                
                <Layout style={{backgroundColor:'transparent'}}>
                    <HHeader setToDisplay={setToDisplay} setsearchData={setsearchData}/>
                    <HContent 
                        stopLoadingf = {setLoading} 
                        toDisplay={toDisplay} 
                        searchData={searchData}
                        setToDisplay={setToDisplay}  
                    /> 
                </Layout>
            }
        </>
    )
}
export default HolisticScheduleD;