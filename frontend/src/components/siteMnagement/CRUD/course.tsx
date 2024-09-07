import React, { useEffect,useRef,useState } from "react"
import {PrivateDefaultApi} from "../../../utils/AxiosInstance"
import RequestHandler from "../../RequestHandler"
import Swal from "sweetalert2"
import {useSelector } from "react-redux"
import Alert from "../../alerts/normalAlert"
import { CourseInt, DepartmentInt, FacultyInt, LecturerInt, OtherStaffInt, ProgramInt } from "../../interfaces"
import { Input } from 'antd';

const { Search } = Input;
const Create:React.FC = () => {
    const titles = useSelector((state: any)=> state.titles)
    const [requestStatus, setRequestStatus] = useState(0)
    const [courseData, setCourseData] = useState<any>([])
    const [groupData, setGroupData] = useState<any[]>([{'group_number': '1'}])

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
      const newGroupNumber = groupData.length + 1;
      setGroupData([...groupData, {'group_number':newGroupNumber}])

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
            if (groupData.length<1){
                setRequestStatus(2)
                return
            }
            const response = await PrivateDefaultApi.post('course/',formData)
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
    const [facultiesD, setFacultiesD] = useState<FacultyInt[]| null>(null)
    const [progrms, setProgrms] = useState<ProgramInt[]| null>(null)
    const [progrmsD, setProgrmsD] = useState<ProgramInt[]| null>(null)
    const [progrmsS, setProgrmsS] = useState<ProgramInt[]| null>(null)
    const [lects, setLects] = useState<LecturerInt[]| null>(null)
    const [stds, setStds] = useState<any>(null)
    const [course_sem, seetCourse_sem] = useState<any>(null)
    const [crs, setCrs] = useState<any>(null)
    const [crsgrp, setCrsGrp] = useState<any>(null)
    const [activitytype, setActivitytype] = useState<any>(null)
    const [uniSemes, setUniSemes] = useState<any>(null)
    const [uniSemesD, setUniSemesD] = useState<any>(null)
    useEffect(()=>{
        const getFac = async() =>{
            try {
                const response0 = await PrivateDefaultApi.get('program/')
                .then((res)=>{
                    setProgrms(res.data)
                    setProgrmsD(res.data)
                    setProgrmsS(res.data)
                })
                const response = await PrivateDefaultApi.get('department/')
                .then((res)=>{
                    setDeps(res.data)
                    setDepsD(res.data)
                })
                const response2 = await PrivateDefaultApi.get('faculty/')
                .then((res)=>{
                    setFaculties(res.data)
                    setFacultiesD(res.data)
                })
                const response3 = await PrivateDefaultApi.get('lecturer/')
                .then((res)=>{
                    setLects(res.data)
                })
                const response4 = await PrivateDefaultApi.get('student/')
                .then((res)=>{
                    setStds(res.data)
                })
                const response5 = await PrivateDefaultApi.get('coursesemester/')
                .then((res)=>{
                    seetCourse_sem(res.data)
                })
                const response6 = await PrivateDefaultApi.get('course/')
                .then((res)=>{
                    setCrs(res.data)
                })
                const response7 = await PrivateDefaultApi.get('activitytype/')
                .then((res)=>{
                    setActivitytype(res.data)
                })
                const response8 = await PrivateDefaultApi.get('semester/')
                .then((res)=>{
                    setUniSemes(res.data)
                    setUniSemesD(res.data)
                })
                const response9 = await PrivateDefaultApi.get('coursegroup/')
                .then((res)=>{
                    setCrsGrp(res.data)
                })
            } catch (error) {
                
            }
        }
        getFac()
    },[])

    return (
      <>
        { requestStatus ===2?(<Alert title="Please create at least one group"  icon="warning"/>):
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
              <label htmlFor="extra_session_of">Status</label>
                <div className="form-check form-switch">
                  <input className="form-check-input" 
                    type="checkbox" 
                    role="switch" 
                    id="flexSwitchCheckChecked" 
                    name="status"
                    checked 
                    onChange={handleCourseChange}
                  />
                  <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
                </div>

              <h2>Groups</h2>
              {groupData.map((group:any, index:number) => (
                <div key={index}>
                  <h3>Group {index + 1}</h3>
                  <input type="hidden" name="group_number" onChange={handleGroupChange(index)} defaultValue={`${index+1}`}/>
                  <label htmlFor="group">Select a course activities type (s):</label>
                  <select 
                    name="activitytype" 
                    id="activitytype"
                    onChange={ handleGroupChange(index)} 
                    className="form-select form-select-lg mb-2" 
                    multiple
                  >
                    <option value="">Select a Type</option>
                      {
                        activitytype?.map((b: any)=>(
                          b?.id&&
                          <option key={b?.id} value={b?.id} selected={group?.activitytype?.includes(b?.id)}>
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
                  <label htmlFor="faculty">Select the Semster:</label>
                  <select 
                    name="coursesemester" 
                    id="coursesemester"
                    onChange={(event) => {
                        handleGroupChange(index)(event)
                      const selectedOptions = Array.from(event.target.options)
                          .filter(option => option.selected)
                          .map(option => option.value);
                      if (uniSemesD) {
                          const filteredData:any = uniSemesD?.filter((d:any) => selectedOptions.find((s:any)=>d.id==s));
                          setUniSemesD(filteredData);
                      }
                    }}
                     
                    className="form-select form-select-lg mb-2" 
                    multiple
                  >
                    <option value="">Select a Course Semester</option>
                    {
                      uniSemes?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.uniSemes?.includes(b?.id)}>
                          {b?.year}_{b?.season}
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
                        const selectedOptions = Array.from(event.target.options)
                          .filter(option => option.selected)
                          .map(option => option.value);
                          const filteredData:any = deps?.filter((d:any) => selectedOptions.find((s:any)=>d.faculty==s));
                        setDepsD(filteredData);
                        // setProgrmsD(progrmsD?.filter((p:any)=>depsD?.includes(p.department))as unknown as ProgramInt[])
                        setFacultiesD(faculties?.filter((f:any)=> selectedOptions.filter((s:any)=>f == s)) as unknown as FacultyInt[]);
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
                        const selectedOptions = Array.from(event.target.options)
                          .filter(option => option.selected)
                          .map(option => option.value);
                          const filteredData:any = progrms?.filter((d:any) => selectedOptions.find((s:any)=>d.department==s));
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
                    onChange={
                      (event)=>{
                        handleGroupChange(index)(event)
                        const selectedOptions = Array.from(event.target.options)
                          .filter(option => option.selected)
                          .map(option => option.value);
                          const filteredData:any = progrms?.filter((d:any) => selectedOptions.find((s:any)=>d.id==s));
                          setProgrmsS(filteredData);
                      }
                     } 
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
                  <label htmlFor="semester">Select a Course Semester(s):</label>
                  <select 
                    name="course_semester" 
                    id="course_semester" 
                    onChange={handleGroupChange(index)} 
                    className="form-select form-select-lg mb-2"
                    multiple
                  >
                    <option value="">Select a Course Semester</option>
                    {
                      course_sem?.map((b: any)=>
                      (uniSemes?.find((u:any)=>u.id===b?.semester)
                      &&depsD?.find((d:any)=>d.id===b?.department)
                      &&facultiesD?.find((f:any)=>f.id===b?.faculty)
                      &&progrmsS?.find((d:any)=>d?.id===b?.program)
                      )&&
                      (
                        <option key={b?.id} value={b?.id} selected={group?.course_semester?.includes(b?.id)}>
                          {uniSemesD?.find((u:any)=>u?.id===b?.semester)?.year}_{uniSemes?.find((u:any)=>u.id===b?.semester).season}-
                          {facultiesD?.find((f:any)=>f?.id===b?.faculty)?.name}-
                          {depsD?.find((d:any)=>d?.id===b?.department)?.name}-
                          {progrmsS?.find((d:any)=>d?.id===b?.program)?.name}-
                          {b?.semester_num}
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
                      crsgrp?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.merged_with?.includes(b?.id)}>
                          {b.code}: {b.title} G{b.group_number}
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
                      crsgrp?.map((b: any)=>(
                        <option key={b?.id} value={b?.id} selected={group?.merged_with?.includes(b?.id)}>
                          {b.code}: {b.title} G{b.group_number}
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
                      defaultChecked = {true}
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
                      checked
                      onChange={handleGroupChange(index)}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
                  </div>
                  <button onClick={() => removeGroup(index)} className="btn btn-outline-danger btn-lg mt-2 ">Remove Group</button>
                </div>
              ))}
              <button onClick={addGroup} type="button" className="btn btn-outline-secondary btn-lg mt-2 ">Add Group</button>
              <br/>
              <button type="submit" className="btn btn-outline-primary btn-lg mt-2 "> Submit </button>
            </div>
          </form>
        </div>
      </>
    )
}

const Edit:React.FC<{id:number}> = (id) => {
  const titles = useSelector((state: any)=> state.titles)
  const [requestStatus, setRequestStatus] = useState(0)
  const [courseData, setCourseData] = useState<any>([])
  const [groupData, setGroupData] = useState<any[]>([])

  const getCurrentData = async()=>{
    await PrivateDefaultApi.get('course/'+id.id+'/')
    .then((res:any)=>{
      console.log('user data', res.data)
      setCourseData(res.data)
      configGroupData(res.data.coursegroup_set)
      })
  }

  const configGroupData=(data:any[] = [])=>{
    data.forEach((item:any) => {
      setGroupData([...groupData,item])
    });
  }
    // Add null values for missing group numbers

  useEffect(()=>{
    getCurrentData()
    console.log(groupData)
  },[id])

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
          // updatedGroupData.find((g:an/y)=>g.group_number===index)[name]=isChecked;
          return updatedGroupData;
        });
      } else if (type === 'select-multiple') {
        // Handle multiple select
        const selectedOptions = Array.from((e.target as HTMLSelectElement).options)
          .filter((option) => option.selected)
          .map((option) => option.value);
        setGroupData(prevGroupData => {
          const updatedGroupData = [...prevGroupData];
          // updatedGroupData.find((g:any)=>g.group_number===index)[name]=selectedOptions;
          updatedGroupData[index][name] = selectedOptions;
          return updatedGroupData;
        });
      } else {
        // Handle other input types
        setGroupData(prevGroupData => {
          const updatedGroupData = [...prevGroupData];
          // updatedGroupData.find((g:any,index:number)=>g.group_number===index)[name+'1']=value;
            updatedGroupData[index][name] = value;
            return updatedGroupData;
        });
      }
    };
    
  
  const addGroup = () => {
    const newGroupNumber = groupData.length + 1;
    setGroupData([...groupData, {'group_number':newGroupNumber}])

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
              id: id.id,
              groups: groupData.map((group: any) => ({ ...group }))
          };
          if (groupData.length<1){
              setRequestStatus(2)
              return
          }
          const response = await PrivateDefaultApi.put('course/'+id.id+'/',formData)
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
  const [facultiesD, setFacultiesD] = useState<FacultyInt[]| null>(null)
  const [progrms, setProgrms] = useState<ProgramInt[]| null>(null)
  const [progrmsD, setProgrmsD] = useState<ProgramInt[]| null>(null)
  const [progrmsS, setProgrmsS] = useState<ProgramInt[]| null>(null)
  const [lects, setLects] = useState<LecturerInt[]| null>(null)
  const [stds, setStds] = useState<any>(null)
  const [course_sem, seetCourse_sem] = useState<any>(null)
  const [crs, setCrs] = useState<any>(null)
  const [crsgrp, setCrsGrp] = useState<any>(null)
  const [activitytype, setActivitytype] = useState<any>(null)
  const [uniSemes, setUniSemes] = useState<any>(null)
  const [uniSemesD, setUniSemesD] = useState<any>(null)
  useEffect(()=>{
      const getFac = async() =>{
          try {
              const response0 = await PrivateDefaultApi.get('program/')
              .then((res)=>{
                  setProgrms(res.data)
                  setProgrmsD(res.data)
                  setProgrmsS(res.data)
              })
              const response = await PrivateDefaultApi.get('department/')
              .then((res)=>{
                  setDeps(res.data)
                  setDepsD(res.data)
              })
              const response2 = await PrivateDefaultApi.get('faculty/')
              .then((res)=>{
                  setFaculties(res.data)
                  setFacultiesD(res.data)
              })
              const response3 = await PrivateDefaultApi.get('lecturer/')
              .then((res)=>{
                  setLects(res.data)
              })
              const response4 = await PrivateDefaultApi.get('student/')
              .then((res)=>{
                  setStds(res.data)
              })
              const response5 = await PrivateDefaultApi.get('coursesemester/')
              .then((res)=>{
                  seetCourse_sem(res.data)
              })
              const response6 = await PrivateDefaultApi.get('course/')
              .then((res)=>{
                  setCrs(res.data)
              })
              const response7 = await PrivateDefaultApi.get('activitytype/')
              .then((res)=>{
                  setActivitytype(res.data)
              })
              const response8 = await PrivateDefaultApi.get('semester/')
              .then((res)=>{
                  setUniSemes(res.data)
                  setUniSemesD(res.data)
              })
              const response9 = await PrivateDefaultApi.get('coursegroup/')
              .then((res)=>{
                  setCrsGrp(res.data)
              })
          } catch (error) {
              
          }
      }
      getFac()
  },[])
  return (
    <>
      { requestStatus ===2?(<Alert title="Please create at least one group"  icon="warning"/>):
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
            <label htmlFor="extra_session_of">Status</label>
              <div className="form-check form-switch">
                <input className="form-check-input" 
                  type="checkbox" 
                  role="switch" 
                  id="flexSwitchCheckChecked" 
                  name="status"
                  checked 
                  onChange={handleCourseChange}
                />
                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
              </div>

            <h2>Groups</h2>
            {groupData.map((group:any, index:number) => (
              group.group_number&&
              <div key={index}>
                <h3>Group {group['group_number']}</h3>
                <input type="number" className="form-control" name="group_number" onChange={
                  (event)=>{
                    if(Number(event.target.value)>0){
                    if(groupData.find((g:any)=>g.group_number===event.target.value)&&group.group_number!==event.target.value)
                      alert('group already exist')
                    else
                        handleGroupChange(index)(event)
                    }else{
                      alert("Please enter valid number")
                    }
                  }

                }
                   value={group.group_number}/>
                <label htmlFor="group">Select a course activities type (s):</label>
                <select 
                  name="activitytype" 
                  id="activitytype"
                  onChange={ handleGroupChange(index)} 
                  className="form-select form-select-lg mb-2" 
                  multiple
                >
                  <option value="">Select a Type</option>
                    {
                      activitytype?.map((b: any)=>(
                        b?.id&&
                        <option key={b?.id} value={b?.id} selected={group?.activitytype?.includes(b?.id)}>
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
                <label htmlFor="faculty">Select the Semster:</label>
                <select 
                  name="coursesemester" 
                  id="coursesemester"
                  onChange={(event) => {
                      handleGroupChange(index)(event)
                    const selectedOptions = Array.from(event.target.options)
                        .filter(option => option.selected)
                        .map(option => option.value);
                    if (uniSemesD) {
                        const filteredData:any = uniSemesD?.filter((d:any) => selectedOptions.find((s:any)=>d.id==s));
                        setUniSemesD(filteredData);
                    }
                  }}
                   
                  className="form-select form-select-lg mb-2" 
                  multiple
                >
                  <option value="">Select a Course Semester</option>
                  {
                    uniSemes?.map((b: any)=>(
                      <option key={b?.id} value={b?.id} selected={group?.uniSemes?.includes(b?.id)}>
                        {b?.year}_{b?.season}
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
                      const selectedOptions = Array.from(event.target.options)
                        .filter(option => option.selected)
                        .map(option => option.value);
                        const filteredData:any = deps?.filter((d:any) => selectedOptions.find((s:any)=>d.faculty==s));
                      setDepsD(filteredData);
                      // setProgrmsD(progrmsD?.filter((p:any)=>depsD?.includes(p.department))as unknown as ProgramInt[])
                      setFacultiesD(faculties?.filter((f:any)=> selectedOptions.filter((s:any)=>f == s)) as unknown as FacultyInt[]);
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
                      const selectedOptions = Array.from(event.target.options)
                        .filter(option => option.selected)
                        .map(option => option.value);
                        const filteredData:any = progrms?.filter((d:any) => selectedOptions.find((s:any)=>d.department==s));
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
                  onChange={
                    (event)=>{
                      handleGroupChange(index)(event)
                      const selectedOptions = Array.from(event.target.options)
                        .filter(option => option.selected)
                        .map(option => option.value);
                        const filteredData:any = progrms?.filter((d:any) => selectedOptions.find((s:any)=>d.id==s));
                        setProgrmsS(filteredData);
                    }
                   } 
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
                <label htmlFor="semester">Select a Course Semester(s):</label>
                <select 
                  name="course_semester" 
                  id="course_semester" 
                  onChange={handleGroupChange(index)} 
                  className="form-select form-select-lg mb-2"
                  multiple
                >
                  <option value="">Select a Course Semester</option>
                  {
                    course_sem?.map((b: any)=>
                    (uniSemes?.find((u:any)=>u.id===b?.semester)
                    &&depsD?.find((d:any)=>d.id===b?.department)
                    &&facultiesD?.find((f:any)=>f.id===b?.faculty)
                    &&progrmsS?.find((d:any)=>d?.id===b?.program)
                    )&&
                    (
                      <option key={b?.id} value={b?.id} selected={group?.course_semester?.includes(b?.id)}>
                        {uniSemesD?.find((u:any)=>u?.id===b?.semester)?.year}_{uniSemes?.find((u:any)=>u.id===b?.semester).season}-
                        {facultiesD?.find((f:any)=>f?.id===b?.faculty)?.name}-
                        {depsD?.find((d:any)=>d?.id===b?.department)?.name}-
                        {progrmsS?.find((d:any)=>d?.id===b?.program)?.name}-
                        {b?.semester_num}
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
                    crsgrp?.map((b: any)=>(
                      <option key={b?.id} value={b?.id} selected={group?.merged_with?.includes(b?.id)}>
                        {b.code}: {b.title} G{b.group_number}
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
                  <option value="">Select the  Courses:</option>
                  {
                    crsgrp?.map((b: any)=>(
                      <option key={b?.id} value={b?.id} selected={group?.extra_session_of?.includes(b?.id)}>
                        {b.code}: {b.title} G{b.group_number}
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
                    checked = {group?.status? true : false}
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
                    checked = {group?.is_elective? true : false}
                    onChange={handleGroupChange(index)}
                  />
                  <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
                </div>
                <button onClick={() => removeGroup(index)} className="btn btn-outline-danger btn-lg mt-2 ">Remove Group</button>
              </div>
            ))}
            <button onClick={addGroup} type="button" className="btn btn-outline-secondary btn-lg mt-2 ">Add Group</button>
            <br/>
            <button type="submit" className="btn btn-outline-primary btn-lg mt-2 "> Update </button>
          </div>
        </form>
      </div>
    </>
  )
}

const List:React.FC = () =>{
  const { Search } = Input;
  const [searchValue, setSearchValue] = useState('');
  const [searchResults,setSearchResult] = useState([])
  const [deps, setDeps] = useState<DepartmentInt[]| null>(null)
  const [faculties, setFaculties] = useState<FacultyInt[]| null>(null)
  const [progrms, setProgrms] = useState<ProgramInt[]| null>(null)
  const titles = useSelector((state: any)=> state.titles)
  const [requestStatus, setRequestStatus] = useState(0)
  const [lecturers, setLecturers] = useState([])
  const handleSearch = (value: string) => {
    search(value);
  };
  const search = async(v:string)=>{
    await PrivateDefaultApi.get('course/?search='+v)
    .then((res)=>{
      setSearchResult(res.data)
    }).catch((error)=>{
      if(error.request.status===404)
        alert(JSON.stringify("No results found"))
    })
  }

  useEffect(()=>{
    const getData = async()=>{
      await PrivateDefaultApi.get('department/')
      .then((res)=>{
        setDeps(res.data)
      }).catch((err)=>{
        setRequestStatus(err.request.status)
      })
      await PrivateDefaultApi.get('faculty/')
      .then((res)=>{
        setFaculties(res.data)
      }).catch((err)=>{
        setRequestStatus(err.request.status)
      })
      await PrivateDefaultApi.get('program/')
      .then((res)=>{
        setProgrms(res.data)
      }).catch((err)=>{
        setRequestStatus(err.request.status)
      })
      await PrivateDefaultApi.get('lecturer/')
      .then((res)=>{
        setLecturers(res.data)
      }).catch((err)=>{
        setRequestStatus(err.request.status)
      })
    }
  })
  function handleDelete(id: number){
    Swal.fire({
        title: "Deleting",
        text: "Do you want to delete this item ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        // cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result:any) => {
        if (result.isConfirmed) {
            try {
                PrivateDefaultApi.delete(`/course/${id}/`)
                .then(()=>{
                <Alert title="Item Deleted" icon='success'/>
                setSearchResult(searchResults.filter((val: any)=> val.id !== id))
                }).catch((err:any)=>{
                    try {
                        <RequestHandler status={err.response.status}/>
                    } catch (error) {
                        <RequestHandler status={0}/>
                    }
                });
            } catch (error: any) {
                console.error("Error in deleting the Item ", error);
                    <RequestHandler status={error.response.status}/>
            }
        }
      });
}
const [edit, setEdit] = useState(0)

const listItems = () => {
    return (
        searchResults.map((item:any) => (
            <tr key={item.id}>
              <td>{item.code}</td>
              <td>{item.title}</td>
              <td>{item.num_group}</td>
              <td>{item.description}</td>
              <td>{item.user_name}</td>
              <td>{item.status?
                    <button type="button" className="btn btn-outline-primary m-2" >Enable</button>: 
                    <button type="button" className="btn btn-outline-danger m-1">Disable</button>}</td>
              <td>
                <button onClick={() => setEdit(item.id)} className="btn btn-outline-primary m-2">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="btn btn-outline-danger m-2">Delete</button>
              </td>
            </tr>
          ))
    )
}
  return (<>
     <div className='container mt-5  d-flex justify-content-center card px-5 py-5' >
      <div className="col-md-6">
        <Search
          placeholder="Enter your search query"
          enterButton="Search"
          size="large"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
        />
        
      </div>
    </div>
    <table className="table table-striped table-hover">
    <thead>
        <tr>
            <th scope="col">Code</th>
            <th scope="col">Title</th>
            <th scope="col">Number of Group</th>
            <th scope="col">Description</th>
            <th scope="col">Created by</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
        </tr>
    </thead>
    <tbody>
        {listItems()}
    </tbody>
</table>
{<RequestHandler status={requestStatus}/>}

{edit !==0? (<Edit id={edit}/>):''}
</>

  );
}

const Course = (props:any) => {
    if(props?.type==='create')
    return <Create/>
    if(props?.type==='list')
    return <List/>
    return <div>{props?.type}</div>
    
}

export default Course
                                                                                                                                                                                                         