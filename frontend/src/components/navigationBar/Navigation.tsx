import { useNavigate } from "react-router-dom";
import TopNavigation from "./topNavigation"
import Cookies from "js-cookie";
import SideBar from "./sideNavigation";
import { useEffect, useState } from "react";


const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
  
    useEffect(() => {
      const token = Cookies.get('token');
      setIsLogin(!!token);
    }, [navigate,isLogin]);
  
    return (
      <>
        <TopNavigation />
        {isLogin && <SideBar />}
      </>
    );
  };
  
export default Navigation