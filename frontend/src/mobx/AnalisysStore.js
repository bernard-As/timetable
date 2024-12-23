import { makeAutoObservable } from "mobx";
import { TiThSmall } from "react-icons/ti";
import { PiChalkboardTeacher } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { FcDepartment } from "react-icons/fc";
import { RiMiniProgramLine } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa6";
class AnalisysStore {
    items = [
        {
            label:"General",
            key:"general",
            icon:<TiThSmall size={28}/>,
        },
        {
            label:'Lecturer',
            key:'lecturer',
            icon:<PiChalkboardTeacher size={28}/>,
        },
        {
            label:'Room',
            key:'room',
            icon:<SiGoogleclassroom size={28}/>,
        },
        {
            label:'Courses',
            key:'courses',
            icon:<FaDiscourse size={28}/>,
        },
        {
            label:'Department',
            key:'department',
            icon:<FcDepartment size={28}/>,
        },
        {
            label: 'Program',
            key: 'program',
            icon: <RiMiniProgramLine size={28} />,
        },
        {
            label:'Student',
            key:'student',
            icon:<PiChalkboardTeacher size={28}/>,
        }
    ];

    selectedAnalisysType = 'general';

    constructor() {
        makeAutoObservable(this);
    }

    selectAnalisysType = (obj) => {
        this.selectedAnalisysType = obj.key;
        console.log(this.selectedAnalisysType);
        
    }
}

const analisysStore = new AnalisysStore();
export default analisysStore;