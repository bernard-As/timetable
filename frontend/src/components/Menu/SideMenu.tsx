import Sider from "antd/es/layout/Sider";
import React, {  useEffect, useState } from 'react';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { MdLogout } from "react-icons/md";
import { GrSchedule, GrSchedules } from "react-icons/gr";
import { Menu, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import rootStore from "../../mobx";
import { observer } from "mobx-react";
import { RiHome2Line, RiMiniProgramLine } from "react-icons/ri";
import { GiBookAura,GiTeacher } from "react-icons/gi";
import { SiGoogleclassroom, SiClickhouse} from "react-icons/si";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiBuilding, PiListStarDuotone,PiStudentThin } from "react-icons/pi";
import { ImListNumbered } from "react-icons/im";
import { FaGripLines } from "react-icons/fa6";
import { FcDepartment } from "react-icons/fc";
import { FaRegCalendarPlus } from "react-icons/fa";
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
const SideMenu: React.FC = observer(() => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [isLogin,setisLogin]:any = useState(false)
    useEffect(()=>{
      const checkTokenValidity2 = async()=> {
        Cookies.get('token') !==null  &&
        await PrivateDefaultApi.post('verify_token').then((res)=>{
            if(res.status === 401){
                setisLogin(false)
                navigate('/welcome')
            }else{
              rootStore.credential = res.data.credential
              setisLogin(true)
            }
        }).catch((error)=>{
          if(error.status===401)
                navigate('/welcome')
        })
      }
      checkTokenValidity2()
    },[navigate])
  const menuItems = [
    {
      key: 0,
      icon: (<Switch defaultChecked onChange={(checked)=>rootStore.enableManagement = checked} />),
      label: "Site Management",
      style: rootStore.isManager()?{display:'block'}:{display:'none'}
    },
    {
      key: 1,
      icon: React.createElement(RiHome2Line),
      label: "Home",
      // style:  (rootStore.enableManagement&&rootStore.isManager())?{color:'white'}:{color:'black'},
      onClick:()=>{
        navigate('/')
      }
    },
    {
      key: 2,
      icon: React.createElement(GrSchedule),
      label: "My timetable",
      onClick: ()=>{
        navigate('/timetable')
      }
    },
    {
      key: 19,
      icon: React.createElement(FaRegCalendarPlus),
      label: "Create Schedule",
      style: (rootStore.enableManagement&&rootStore.isManager())?{display:'block'}:{display:'none'},
      onClick: ()=>{
        navigate('/holistic-schedule/create_schedule')
      }
    },
    {
      key: 3,
      icon: React.createElement(GrSchedules),
      label: "Holistic Schedule",
      children: [
        { 
          key: 4, 
          icon: React.createElement(GiBookAura),
          label: 'Course',
          onClick: ()=>{
            navigate('/holistic-schedule/course')
          },
          style:
              (rootStore.holisticScheduleStore.checkCredentialAllowence('course')
              &&rootStore.holisticScheduleStore.checkAllowDisplay('course'))?{display:'block'}:{display:'none'}
        },
        { 
          key: 5, 
          icon: React.createElement(SiGoogleclassroom),
          label: 'Room',
          onClick: ()=>{
            navigate('/holistic-schedule/room')
          },
          style:
              (rootStore.holisticScheduleStore.checkCredentialAllowence('room')
              &&rootStore.holisticScheduleStore.checkAllowDisplay('room'))?{display:'block'}:{display:'none'}
        },
        { 
          key: 6, 
          icon: React.createElement(GiTeacher),
          label: 'Lecturer',
          onClick: ()=>{
            navigate('/holistic-schedule/lecturer')
          },style:
          (rootStore.holisticScheduleStore.checkCredentialAllowence('lecturer')
          &&rootStore.holisticScheduleStore.checkAllowDisplay('lecturer'))?{display:'block'}:{display:'none'}
        },
        { 
          key: 7, 
          icon: React.createElement(LiaChalkboardTeacherSolid),
          label: 'Assistant',
          onClick: ()=>{
            navigate('/holistic-schedule/assistant')
          },
          style:
              (rootStore.holisticScheduleStore.checkCredentialAllowence('assistant')
              &&rootStore.holisticScheduleStore.checkAllowDisplay('assistant'))?{display:'block'}:{display:'none'}
        },
        { 
          key: 8, 
          icon: React.createElement(PiStudentThin),
          label: 'Student',
          onClick: ()=>{
            navigate('/holistic-schedule/student')
          },
          style:
              (rootStore.holisticScheduleStore.checkCredentialAllowence('student')
              &&rootStore.holisticScheduleStore.checkAllowDisplay('student'))?{display:'block'}:{display:'none'}
        },
        { 
          key: 9, 
          icon: React.createElement(ImListNumbered),
          label: 'Semester',
          onClick: ()=>{
            navigate('/holistic-schedule/semester')
          },
          style:
              (rootStore.holisticScheduleStore.checkCredentialAllowence('semester')
              &&rootStore.holisticScheduleStore.checkAllowDisplay('semester'))?{display:'block'}:{display:'none'}
        },
        { 
          key: 10, 
          icon: React.createElement(FcDepartment),
          label: 'Department',
          onClick: ()=>{
            navigate('/holistic-schedule/department')
          },
          style:
              (rootStore.holisticScheduleStore.checkCredentialAllowence('department')
              &&rootStore.holisticScheduleStore.checkAllowDisplay('department'))?{display:'block'}:{display:'none'}
        },
        { 
          key: 11, 
          icon: React.createElement(RiMiniProgramLine),
          label: 'Program',
          onClick: ()=>{
            navigate('/holistic-schedule/program')
          },
          style:
              (rootStore.holisticScheduleStore.checkCredentialAllowence('program')
              &&rootStore.holisticScheduleStore.checkAllowDisplay('program'))?{display:'block'}:{display:'none'}
        },
        { 
          key: 12, 
          icon: React.createElement(SiClickhouse),
          label: 'Faculty',
          onClick: ()=>{
            navigate('/holistic-schedule/faculty')
          },
          style:
              (rootStore.holisticScheduleStore.checkCredentialAllowence('faculty')
              &&rootStore.holisticScheduleStore.checkAllowDisplay('faculty'))?{display:'block'}:{display:'none'}
        },
        { 
          key: 13, 
          icon: React.createElement(FaGripLines),
          label: 'Floor',
          onClick: ()=>{
            navigate('/holistic-schedule/floor')
          },
          style:
              (rootStore.holisticScheduleStore.checkCredentialAllowence('floor')
              &&rootStore.holisticScheduleStore.checkAllowDisplay('floor'))?{display:'block'}:{display:'none'}
        },
        { 
          key: 14, 
          icon: React.createElement(PiBuilding),
          label: 'Building',
          onClick: ()=>{
            navigate('/holistic-schedule/building')
          },
          style:
              (rootStore.holisticScheduleStore.checkCredentialAllowence('building')
              &&rootStore.holisticScheduleStore.checkAllowDisplay('building'))?{display:'block'}:{display:'none'}
        },
        { 
          key: 15, 
          icon: React.createElement(PiListStarDuotone),
          label: 'Complete',
          onClick: ()=>{
            navigate('/holistic-schedule/complete')
          },
          style:
              (rootStore.holisticScheduleStore.checkCredentialAllowence('complete')
              &&rootStore.holisticScheduleStore.checkAllowDisplay('complete'))?{display:'block'}:{display:'none'}
        },
      ],
      
    },
    // {
    //   key: 16,
    //   icon: React.createElement(UserOutlined),
    //   label: "Profile",
    // },
    // {
    //   key: 17,
    //   icon: React.createElement(SettingOutlined),
    //   label: "Settings",
    // },
    {
      key: 18,
      icon: React.createElement(MdLogout),
      label: "Logout",
      onClick: () => {
        Cookies.remove("token");
        navigate("/login");
      },
      style:isLogin?{display:'block'}:{display:'none'}
    },
  ];

  // Handle dark mode setting from localStorage or Cookies
  // Handle auto-collapse based on screen size
  const handleCollapse = (collapsedState:any) => {
    setCollapsed(collapsedState);
    rootStore.mainStore.sideMenuCollapse = collapsedState;
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      breakpoint="lg"
      collapsedWidth="80"
      className="sider-container"
      style={rootStore.mainStore.darkMode ? { backgroundColor: '#52616B' } : { backgroundColor: '#C9D6DF' }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        items={menuItems}
        className="side-menu"
      />
    </Sider>
  );
});

export default SideMenu;
