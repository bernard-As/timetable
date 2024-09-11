import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import rootStore from "../../../mobx";
import HolisticSchedule404 from "./HolisticSchedule404";

const HolisticScheduleD:React.FC=()=>{
    const navigate = useNavigate();
    const location = useLocation();
    const [canDisplay,setCanDisplay] = useState(false)

    useEffect(()=>{
        setCanDisplay(rootStore.holisticScheduleStore.checkDisplayAvailability(location))
    },[navigate])

    return (
        <>
            {canDisplay&&
            <div>holistic schedule D</div>
            }
            {
                !canDisplay&&<HolisticSchedule404/>
            }
        </>
    )
}
export default HolisticScheduleD;