import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from "./Main"

const ContentRoutes: React.FC = ()=>{
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
            </Routes>
        </Router>
    )
}
export default ContentRoutes;