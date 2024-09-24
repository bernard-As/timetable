import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import P404 from './components/404page';
import SiteManagement from './components/siteMnagement/main';
import LandingPage from './components/LandingPage';
import  Login  from './components/Login';
const MainRoutes: React.FC = ()=>{
    return (
        <Router>
            <Routes>
              <Route path='/*' element={<Home />}/>
              <Route path='/home/*' element={<Home />}/>
              <Route path='/welcome' element={<LandingPage />}/>
              <Route path='/landing' element={<LandingPage />}/>
              {/* <Route path='/test' element={<Test />}/> */}
              <Route path='/login' element={<Login />}/>
              <Route path='/siteManagement' element={<SiteManagement />}/>
              <Route path='*' element={<P404 />}/>
              <Route path='*' element={<P404 />}/>
            </Routes>
        </Router>
    )
}

export default MainRoutes;