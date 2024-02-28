import React, { useEffect,useRef,useState } from "react"
import axiosInstance from "../../AxiosInstance"
import RequestHandler from "../../RequestHandler"
import Swal from "sweetalert2"
import {useSelector } from "react-redux"
import Alert from "../../alerts/normalAlert"
import { CourseInt, DepartmentInt, FacultyInt, LecturerInt, OtherStaffInt, ProgramInt } from "../../interfaces"

const Create:React.FC = () => {
    const titles = useSelector((state: any)=> state.titles)
    const [requestStatus, setRequestStatus] = useState(0)
    const [courseData, setCourseData] = useState<any>([])
    const [groupData, setGroupData] = useState<any[]>([])

    interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}
    interface SelectChangeEvent extends React.ChangeEvent<HTMLSelectElement> {}
    interface TextareaChangeEvent extends React.ChangeEvent<HTMLTextAreaElement> {}
    type ChangeEventHandler = (e: InputChangeEvent | SelectChangeEvent | TextareaChangeEvent) => void;

    const handleCourseChange: ChangeEventHandler = (e) => {
      const { name, value, type } = e.target;

      if (type === 'checkbox') {
        const isChecked = (e.target as HTMLInputElement).checked;
        // Handle checkbox input
        setCourseData({ ...courseData, [name]: isChecked });
      } else if (type === 'select-multiple') {
        // Handle multiple select
        const selectedOptions = Array.from((e.target as HTMLSelectElement).options)
          .filter((option) => option.selected)
          .map((option) => option.value);
        setCourseData({ ...courseData, [name]: selectedOptions });
      } else {
        // Handle other input types
        setCourseData({ ...courseData, [name]: value });
      }
    };
    const handleGroupChange = (index: number) => (e: React.ChangeEvent<any>) => {
        const { name, value, type } = e.target;
      
        if (type === 'checkbox') {
          const isChecked = (e.target as HTMLInputElement).checked;
          // Handle checkbox input
          setGroupData(prevGroupData => {
            const updatedGroupData = [...prevGroupData];
            updatedGroupData[index][name] = isChecked;
            return updatedGroupData;
          });
        } else if (type === 'select-multiple') {
          // Handle multiple select
          const selectedOptions = Array.from((e.target as HTMLSelectElement).options)
            .filter((option) => option.selected)
            .map((option) => option.value);
          setGroupData(prevGroupData => {
            const updatedGroupData = [...prevGroupData];
            updatedGroupData[index][name] = selectedOptions;
            return updatedGroupData;
          });
        } else {
          // Handle other input types
          setGroupData(prevGroupData => {
            const updatedGroupData = [...prevGroupData];
            updatedGroupData[index][name] = value;
            return updatedGroupData;
          });
        }
      };
      
    
    const addGroup = () => {
        setGroupData([...groupData, {}])
    };
      
    const removeGroup = (index: number) => {
      const newGroups = [...groupData];
      newGroups.splice(index, 1);
      setGroupData(newGroups);
    };
    const handleSubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = {
                ...courseData,
                groups: groupData.map((group: any) => ({ ...group }))
            };
            console.log(formData)
            const response = await axiosInstance.post('course/',formData)
            setRequestStatus(response.status)
        } catch (error:any) {
            try{
                if(error.response.status){
                    try {
                        if(error.response.status === 400 &&  error.response.data.lecturerid)
                        setRequestStatus(2)
                    } catch (err) {
                        setRequestStatus(error.response.status)
                        
                    }
                    setRequestStatus(error.response.status)

                }

            }catch(error){
                setRequestStatus(1)
            }
        }
    };
    const [deps, setDeps] = useState<DepartmentInt[]| null>(null)
    const [depsD, setDepsD] = useState<DepartmentInt[]| null>(null)
    const [faculties, setFaculties] = useState<FacultyInt[]| null>(null)
    const [progrms, setProgrms] = useState<ProgramInt[]| null>(null)
    const [progrmsD, setProgrmsD] = useState<ProgramInt[]| null>(null)
    const [lects, setLects] = useState<LecturerInt[]| null>(null)
    const [stds, setStds] = useState<any>(null)
    const [course_sem, seetCourse_sem] = useState<any>(null)
    const [crs, setCrs] = useState<any>(null)
    const [activitytype, setActivitytype] = useState<any>(null)
    useEffect(()=>{
        const getFac = async() =>{
            try {
                const response0 = await axiosInstance.get('program/')
                .then((res)=>{
                    setProgrms(res.data)
                    setProgrmsD(res.data)
                })
                const response = await axiosInstance.get('department/')
                .then((res)=>{
                    setDeps(res.data)
                    setDepsD(res.data)
                })
                const response2 = await axiosInstance.get('faculty/')
                .then((res)=>{
                    setFaculties(res.data)
                })
                const response3 = await axiosInstance.get('lecturer/')
                .then((res)=>{
                    setLects(res.data)
                })
                const response4 = await axiosInstance.get('student/')
                .then((res)=>{
                    setStds(res.data)
                })
                const response5 = await axiosInstance.get('coursesemester/')
                .then((res)=>{
                    seetCourse_sem(res.data)
                })
                const response6 = await axiosInstance.get('course/')
                .then((res)=>{
                    setCrs(res.data)
                })
                const response7 = await axiosInstance.get('activitytype/')
                .then((res)=>{
                    setActivitytype(res.data)
                })
            } catch (error) {
                
            }
        }
        getFac()
    },[])

    return (
      <>
        {
          requestStatus!==0 && (
              <RequestHandler status={requestStatus}/>
          )
        }
        <div className='container mt-5  d-flex justify-content-center card px-5 py-5' >
          <form className="row g-3" onSubmit={handleSubmit} autoComplete="off">
            <div className="col-md-6">
              <label htmlFor="code" className="form-label">Code</label>
              <input 
                type="text" 
                className="form-control" 
                name="code" 
                placeholder="ENGL001" 
                value={courseData?.code}
                onChange={handleCourseChange}
                required
              />
              <label htmlFor="title"  className="form-label">Title</label>
              <input 
                type="text" 
                className="form-control"  
                name='title'  
                placeholder="English for beginners" 
                value={courseData?.title}
                onChange={handleCourseChange}
                required
              />
              <label htmlFor="extra_session_of">Desciption</label>
              <div className="form-floating">
                <textarea className="form-control" 
                  name = 'description'   
                  placeholder="Leave a Description Here"
                  value = {courseData?.description}
                  onChange={handleCourseChange} 
                  id="floatingTextarea"
                >
                </textarea>
                <label htmlFor="floatingTextarea">Description</label>
              </div>
              <h2>Groups</h2>
              {groupData.map((group:any, index:number) => (
                <div key={index}>
                  <h3>Group {index + 1}</h3>
                  <label htmlFor="group">Select a course activities type (s):</label>
                  <select 
                    name="type" 
                    id="type"
                    onChange={ handleGroupChange(index)} 
                    className="form-select form-select-lg mb-2" 
                    multiple
                  >
                    <option value="">Select a Type</option>
                      {
                        activitytype?.map((b: any)=>(
                          b?.id&&
                          <option key={b?.id} value={b?.id} selected={group?.type?.includes(b?.id)}>
                              {b.name}
                          </option>
                        ))
                      }
                  </select>
                  <label htmlFor="max_capacity"  className="form-label">Max  Capacity (Number of Students)</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='max_capacity'  
                    id='max_capacity'
                    placeholder="Max Number of student for this course" 
                    value={group?.max_capacity}
                    onChange={handleGroupChange(index)}
                  />
                  <label htmlFor="lecturer">Select a Lecturer:</label>
                  <select 
                    name="lecturer" 
                    id="lecturer"
                    onChange={ handleGroupChange(index)} 
                    className="form-select form-select-lg mb-2" 
                  >
                    <option value="">Select a Lecturer</option>
                    {
                      lects?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.lecturer === b?.id}>
                          {b.first_name} {b.last_name}
                        </option>
                      ))
                    }
                  </select>
                  <label htmlFor="lecturer_assistant">Select a Lecturer Assistant:</label>
                  <select 
                    name="lecturer_assistant" 
                    id="lecturer_assistant"
                    onChange={ handleGroupChange(index)} 
                    className="form-select form-select-lg mb-2" 
                  >
                    <option value="">Select a Lecturer Assistant</option>
                    {
                      lects?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.lecturer_assistant === b?.id}>
                          {b.first_name} {b.last_name}
                        </option>
                      ))
                    }
                  </select>
                  <label htmlFor="assistant">Select an Assistant (optional):</label>
                  <select 
                    name="assistant" 
                    id="assistant"
                    onChange={ handleGroupChange(index)} 
                    className="form-select form-select-lg mb-2" 
                  >
                    <option value="">Select an assistant</option>
                    {
                      stds?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.assistant === b?.id}>
                          {b.first_name} {b.last_name}
                        </option>
                      ))
                    }
                  </select>
                  <label htmlFor="faculty">Select the Faculty:</label>
                  <select 
                    name="faculty" 
                    id="faculty"
                    onChange={
                      (event)=>{
                        handleGroupChange(index)(event)
                        let val:any = event.target.value
                        const filteredData:any = deps?.filter((d) => d.faculty == val);
                        setDepsD(filteredData);
                      }
                     } 
                    className="form-select form-select-lg mb-2" 
                    multiple
                  >
                    <option value="">Select a faculty</option>
                    {
                      faculties?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.faculty?.includes(b?.id)}>
                          {b.shortname}: {b.name}
                        </option>
                      ))
                    }
                  </select>
                  <label htmlFor="department">Select Department(s):</label>
                  <select 
                    name="department" 
                    id="department" 
                    onChange={
                      (event)=>{
                        handleGroupChange(index)(event)
                        let val:any = event.target.value 
                        const filteredData:any = progrms?.filter((p) => p.department == val);
                        setProgrmsD(filteredData);
                      }
                     }
                    className="form-select form-select-lg mb-2"  
                    multiple
                  >
                    <option value="">Select a department(s)</option>
                    {
                      depsD?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.department?.includes(b?.id)}>
                          {b.shortname}: {b.name}
                        </option>
                      ))
                    }
                  </select>
                  <label htmlFor="department">Select Program(s):</label>
                  <select 
                    name="program" 
                    id="program" 
                    onChange={handleGroupChange(index)} 
                    className="form-select form-select-lg mb-2" 
                    multiple 
                  >
                    <option value="">Select a program</option>
                    {
                      progrmsD?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.program?.includes(b?.id)}>
                          {b.shortname}: {b.name}
                        </option>
                      ))
                    }
                  </select>
                  <label htmlFor="semester">Select a Semester(s):</label>
                  <select 
                    name="program" 
                    id="program" 
                    onChange={handleGroupChange(index)} 
                    className="form-select form-select-lg mb-2" 
                    multiple 
                  >
                    <option value="">Select a program</option>
                    {
                      progrmsD?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.program?.includes(b?.id)}>
                          {b.shortname}: {b.name}
                        </option>
                      ))
                    }
                  </select>
                  <label htmlFor="duration"  className="form-label">Duration</label>
                  <input 
                    type="text"
                    className="form-control" 
                    name='duration'  
                    id='duration'
                    placeholder="Eg: 2  2*2 2*2*2" 
                    value={group?.duration}
                    onChange={handleGroupChange(index)}
                  />
                  <label htmlFor="course">Select the Merged Courses:</label>
                  <select 
                    name="merged_with" 
                    id="merged_with"
                    onChange={handleGroupChange(index) }
                    className="form-select form-select-lg mb-2" 
                    multiple
                  >
                    <option value="">Select the Merged Courses:</option>
                    {
                      crs?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.merged_with?.includes(b?.id)}>
                          {b.code}: {b.title}
                        </option>
                      
                      ))
                    }
                  </select>
                  <label htmlFor="extra_session_of">Extra Session Of:</label>
                  <select 
                    name="extra_session_of" 
                    id="extra_session_of"
                    onChange={handleGroupChange(index)}
                    className="form-select form-select-lg mb-2" 
                    multiple
                  >
                    <option value="">Select the Merged Courses:</option>
                    {
                      crs?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.extra_session_of?.includes(b?.id)}>
                          {b.code}: {b.title}
                        </option>
                      ))
                    }
                  </select>
                  <label htmlFor="extra_session_of">Status</label>
                  <div className="form-check form-switch">
                    <input className="form-check-input" 
                      type="checkbox" 
                      role="switch" 
                      id="flexSwitchCheckChecked" 
                      name="status"
                      checked = {group?.status}
                      onChange={handleGroupChange(index)}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
                  </div>
                  <label htmlFor="extra_session_of">Is Elective </label>
                  <div className="form-check form-switch">
                    <input className="form-check-input" 
                      type="checkbox" 
                      role="switch" 
                      id="flexSwitchCheckChecked" 
                      name="is_elective"
                      checked = {group?.is_elective}
                      onChange={handleGroupChange(index)}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
                  </div>
                  <button onClick={() => removeGroup(index)}>Remove Group</button>
                </div>
              ))}
              <button onClick={addGroup} type="button">Add Group</button>
              <button type="submit" className="btn btn-outline-primary btn-lg mt-2 "> Add </button>
            </div>
          </form>
        </div>
      </>
    )
}
const Course = (props:any) => {
    if(props?.type==='create')
    return <Create/>
    // if(props?.type==='list')
    // return <List/>
    return <div>{props?.type}</div>
    
}

export default Course
                                                                                                                                                                                                         