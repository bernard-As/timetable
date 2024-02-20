import { useState } from "react";
import { useSelector } from 'react-redux';

const SideBar: React.FC = () =>{
    const [showSideMenu,setShowSideMenu] = useState(false)
    const userGroup = useSelector((state: any)=>state.user.group)

    function handleHumb () {
        setShowSideMenu(!showSideMenu);
    }
    return (
        <>
            <div className="container-fluid">
                <div className={`header_toggle hamb ${showSideMenu?'hamb-move':''}`} onClick={handleHumb}> <i className="bx bx-menu" id="header-toggle"></i> Humb</div>
                <nav className={ `col-md-2  d-md-block  sidebar ${ showSideMenu ?'sidebar-move':''}`}>
                    <div className="sidebar-sticky">
                        <ul className="nav flex-column">
                            <li className={`nav-item ${window.location.pathname === "/" ? 'active' : ''}`}>
                                <a className="nav-link" href="/" >
                                    Timetable
                                </a>
                            </li>
                            <li className="nav-item" style={{marginTop:20}}>
                                <a className="nav-link active" href="#" >
                                    Dashboard
                                </a>
                            </li>
                            {
                                userGroup === 'visitor' &&
                                (
                                    <li className="nav-item" style={{marginTop:20}}>
                                        <a className="nav-link active" href="/siteManagement/" >
                                            Site Management
                                        </a>
                                    </li>
                                )
                            }
                            <li className="nav-item">
                                <a className="nav-link" href="/users">
                                    Users
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Orders
                                </a>
                            </li>
                        </ul>
                
                    </div>
                </nav>
            </div>
        </>
    )
}
export default SideBar;