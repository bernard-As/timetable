import { useEffect, useState } from "react"
import Title from "./CRUD/title";
import User from "./CRUD/users";
import General from "./CRUD/general";
import Semester from "./CRUD/semester";
import Building from "./CRUD/building";
import Floor from "./CRUD/floor";
import Room from "./CRUD/room";
import Faculty from "./CRUD/faculty";
import Department from "./CRUD/department";
import Program from "./CRUD/program";
import CourseSemester from "./CRUD/coursesemester";
import Lecturer from "./CRUD/lecturer";
import Student from "./CRUD/student";
import OtherStaff from "./CRUD/otherstaff";
const SiteManagement = () =>{
    const [actions, setAction] = useState({
        object: '',
        method: ''
    })
    const models = [
        ['Title','The title of the The instructor (ex: Dr.)'],
        // ['Users','Users of the all the system'],
        ['General','General settings'],
        ['Semester','Semester Settings'],
        ['Building','Building Settings'],
        ['Floor','Floor for each building'],
        ['Room','Class room information'],
        ['Faculty','Faculty information'],
        ['Department','Department information'],
        ['Program','Program information'],
        ['CourseSemester','Opened semester for each program or departement'],
        ['Lecturer','Lecturer Setting'],
        ['Student','Student Setting'],
        ['OtherStaff','Other Staff Setting'],
        ]
    const handleclick = (obj:string, meth: string) => {
        return setAction({object:obj,method:meth});
    }
    const componentMap:any = {
        title: Title,
        user: User,
        general: General,
        semester: Semester,
        building: Building,
        floor: Floor,
        room: Room,
        faculty: Faculty,
        department: Department,
        program: Program,
        coursesemester: CourseSemester,
        lecturer: Lecturer,
        student: Student,
        otherstaff: OtherStaff
    }
    const SelectedComponent:any = componentMap[actions.object]
      
      
    return (
        <div id="siteManagement" className="TopperDiv">
            <h1>Site Managemnt</h1><hr/><br/>
            <div className="container">
            <div className="row d-flex  justify-content-center">
           { models.map((model)=>(
            <div className="card w-50 m-2">
                <div className="card-body">
                  <h5 className="card-title">{model[0]}</h5>
                  <p className="card-text">{model[1]}</p>
                  <button onClick={() => handleclick(model[0].toLocaleLowerCase(),'create')} className="btn btn-primary m-2">Create</button>
                  <button onClick={() => handleclick(model[0].toLocaleLowerCase(),'list')} className="btn btn-primary m-2">List</button>
                </div>
            </div>
           )
            )}
            </div>
        </div>
        <div id="content">
            {
                SelectedComponent && <SelectedComponent type={actions.method} />
            }
        </div>
        </div>
    )
}
export default SiteManagement
