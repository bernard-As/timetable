import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from "./Main"
import P404 from './404page';
import HolisticSchedule from './Content/HolisticSchedule';
import MyTimetable from './MyTimeTable';
const ContentRoutes: React.FC = ()=>{
    return(
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/holistic-schedule/*" element={<HolisticSchedule />} />
            <Route path="/timetable" element={<MyTimetable />} />
            <Route path="/*" element={<P404 />} />
        </Routes>
    )
}
export default ContentRoutes;