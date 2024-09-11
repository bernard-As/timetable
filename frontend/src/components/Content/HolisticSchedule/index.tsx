import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CompleteSchedule from './Complete';
import HolisticScheduleD from './HolisticScheduleD';

const HolisticSchedule:React.FC =()=>{
    return(
        <Routes>
            <Route path="/complete" element={<CompleteSchedule/>} />
            <Route path="/*" element={<HolisticScheduleD />} />
        </Routes>
    )
}

export default HolisticSchedule;