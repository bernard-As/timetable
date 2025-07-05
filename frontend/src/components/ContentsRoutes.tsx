import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from "./Main"
import P404 from './404page';
import HolisticSchedule from './Content/HolisticSchedule';
import MyTimetable from './MyTimeTable';
import CompleteSchedule from './Complete';
import Migration from './Migration';
import CourseSelection from './CourseSelection';
import AdminPanel from './CourseSelection/AdminPanel';
import AdminStatistics from './CourseSelection/AdminStatistics';
const ContentRoutes: React.FC = ()=>{
    return(
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/course-selection" element={<CourseSelection />} />
            <Route path="/course-selection-admin" element={<AdminPanel />} />
            <Route path="/course-selection-statistics" element={<AdminStatistics />} />
            <Route path="/holistic-schedule/*" element={<HolisticSchedule />} />
            <Route path="/timetable" element={<MyTimetable />} />
            <Route path="/complete" element={<CompleteSchedule />} />
            <Route path="/migration" element={<Migration />} />
            <Route path="/*" element={<P404 />} />
        </Routes>
    )
}
export default ContentRoutes;