import React, { useEffect,useRef,useState } from "react"
import axiosInstance from "../../AxiosInstance"
import RequestHandler from "../../RequestHandler"
import Swal from "sweetalert2"
import Alert from "../../alerts/normalAlert"
import { CourseSemesterInt, DepartmentInt,FacultyInt,ProgramInt, SemesterInt } from "../../interfaces"
const Create:React.FC = () => {
    const [requestStatus, setRequestStatus] = useState(0)
    const [formData, setFormData] = useState<CourseSemesterInt>({
        id:0,
        department:0,
        program:0,
        semester_num:0,
        semester:0,
        description: '',
        status: false
    })
    const [deps, setDeps] = useState<DepartmentInt[]| null>(null)
    const [depsD, setDepsD] = useState<DepartmentInt[]| null>(null)
    const [faculties, setFaculties] = useState<FacultyInt[]| null>(null)
    const [progrms, setProgrms] = useState<ProgramInt[]| null>(null)
    const [progrmsD, setProgrmsD] = useState<ProgramInt[]| null>(null)
    const [sems, setSems] = useState<SemesterInt[]| null>(null)
    useEffect(()=>{
        document.title = 'Course Semester Setting'
    })
    useEffect(()=>{
        setTimeout(() => {
            setRequestStatus(0)
        }, 500);
    },[requestStatus])
    /* Get Faculties*/
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
                const response3= await axiosInstance.get('semester/')
                .then((res)=>{
                    setSems(res.data)
                })
            } catch (error) {
                
            }
        }
        getFac()
    },[])
    interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}
    interface SelectChangeEvent extends React.ChangeEvent<HTMLSelectElement> {}
    interface TextareaChangeEvent extends React.ChangeEvent<HTMLTextAreaElement> {}
    type ChangeEventHandler = (e: InputChangeEvent | SelectChangeEvent | TextareaChangeEvent) => void;
    const handleChange: ChangeEventHandler = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('coursesemester/',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setRequestStatus(response.status)
        } catch (error:any) {
            try{
                if(error.response.status)
                    setRequestStatus(error.response.status)
            }catch(error){
                setRequestStatus(1)
            }

        }
    }
    return(
        <>
        {
            requestStatus!==0 && (
                <RequestHandler status={requestStatus}/>
            )
        }
        <div className='container mt-5  d-flex justify-content-center card px-5 py-5' >
            <form className="row g-3" onSubmit={handleSubmit} autoComplete="off">
                <div className="col-md-6">
                <label htmlFor="semster">Select the Semester:</label>
                    <select 
                        name="semester" 
                        id="semester"
                        onChange={handleChange} 
                        className="form-select form-select-lg mb-2" 

                    >
                      <option value="">Select a semester</option>
                      {
                          sems?.map((b: SemesterInt)=>(
                            b.status &&
                              <option key={b?.id} value={b?.id}>
                                  {b.season}: {b.year}
                              </option>
                          ))
                      }
                    </select>
                  <label htmlFor="faculty">Select the Faculty:</label>
                    <select 
                        name="faculty" 
                        id="faculty"
                        value={faculties?.find((item)=> item.id === deps?.find((d)=>d.id === formData.department)?.faculty)?.id}
                        onChange={
                            (event)=>{
                                let val = event.target.value as unknown as number
                                const filteredData:any = deps?.filter((d) => d.faculty == val);
                                setDepsD(filteredData);
                            }
                         } 
                        className="form-select form-select-lg mb-2" 

                    >
                      <option value="">Select a faculty</option>
                      {
                          faculties?.map((b: any)=>(
                              <option key={b?.id} value={b?.id}>
                                  {b.shortname}: {b.name}
                              </option>
                          ))
                      }
                    </select>
                  <label htmlFor="department">Select the Department:</label>
                    <select 
                        name="department" 
                        id="department" 
                        onChange={
                            (event)=>{
                                handleChange(event)
                                let val = event.target.value as unknown as number
                                const filteredData:any = progrms?.filter((p) => p.department == val);
                                setProgrmsD(filteredData);
                            }
                         }
                        value={formData.department}
                        
                        className="form-select form-select-lg mb-2"  
                    required>
                      <option value="">Select a department</option>
                      {
                          depsD?.map((b: any)=>(
                              <option key={b?.id} value={b?.id}>
                                  {b.shortname}: {b.name}
                              </option>
                          ))
                      }
                    </select>
                  <label htmlFor="department">Select the Program:</label>
                    <select 
                        name="program" 
                        id="program" 
                        onChange={handleChange} 
                        value={formData.program}
                        className="form-select form-select-lg mb-2"  
                    required>
                      <option value="">Select a program</option>
                      {
                          progrmsD?.map((b: any)=>(
                              <option key={b?.id} value={b?.id}>
                                  {b.shortname}: {b.name}
                              </option>
                          ))
                      }
                    </select>
                  <label htmlFor="semester_number"  className="form-label">Semester Number</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='semester_num'  
                    id='semester_num'
                    placeholder="semester number.." 
                    value={formData.semester_num}
                    onChange={handleChange}
                  />
                  <div className="form-check form-switch">
                    <input className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id="flexSwitchCheckChecked" 
                        name="status"
                        checked = {formData.status}
                        onChange={()=>{setFormData({...formData,status : !formData.status})}}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
                  </div>

                  <label htmlFor="validationCustom01"  className="form-label">Description</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='description'  
                    placeholder="Description..." 
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <button type="submit" className="btn btn-outline-primary btn-lg mt-2 "> Add</button>
                </div>
            </form>
        </div>
        </>
    )
}

const Edit:React.FC<{id:number}> =(id) =>{
    const [requestStatus, setRequestStatus] = useState(0)
    const [showEdit, setShowEdit] = useState(true)
    const [formData, setFormData] = useState<CourseSemesterInt>({
        id:0,
        department:0,
        program:0,
        semester_num:0,
        semester:0,
        description: '',
        status: false
    })
    const [currentId, setCurrentId] = useState(id.id);
    const [deps, setDeps] = useState<DepartmentInt[]| null>(null)
    const [depsD, setDepsD] = useState<DepartmentInt[]| null>(null)

    useEffect(()=>{
        document.title = 'Edit Course Semester'
    },[])

    useEffect(()=>{
        axiosInstance.get(`/coursesemester/${id.id}/`)
        .then((res:any)=>{
            setShowEdit(true)
            setFormData(res.data)
            })
            .catch((err: any)=>{
                setRequestStatus(err.status)
            })
    },[currentId])

    const [faculties, setFaculties] = useState<FacultyInt[]| null>(null)
    const [progrms, setProgrms] = useState<ProgramInt[]| null>(null)
    const [progrmsD, setProgrmsD] = useState<ProgramInt[]| null>(null)
    const [sems, setSems] = useState<SemesterInt[]| null>(null)

    useEffect(()=>{
        const getFac = async() =>{
            try {
                const response = await axiosInstance.get('faculty/')
                .then((res)=>{
                    setFaculties(res.data)
                })
                const response2 = await axiosInstance.get('department/')
                .then((res)=>{
                    setDeps(res.data)
                    setDepsD(res.data)
                })
                const response0 = await axiosInstance.get('program/')
                .then((res)=>{
                    setProgrms(res.data)
                    setProgrmsD(res.data)
                })
                const response3= await axiosInstance.get('semester/')
                .then((res)=>{
                    setSems(res.data)
                })
            } catch (error) {
                
            }
        }
        getFac()
    },[])

    interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}
    interface SelectChangeEvent extends React.ChangeEvent<HTMLSelectElement> {}
    interface TextareaChangeEvent extends React.ChangeEvent<HTMLTextAreaElement> {}
    type ChangeEventHandler = (e: InputChangeEvent | SelectChangeEvent | TextareaChangeEvent) => void;
    const handleChange: ChangeEventHandler = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('coursesemester/',formData)
            setRequestStatus(response.status)
        } catch (error:any) {
            try{
                if(error.response.status)
                    setRequestStatus(error.response.status)
            }catch(error){
                setRequestStatus(1)
            }

        }
    }

    useEffect(()=>{
        setTimeout(() => {
            setRequestStatus(0)
        }, 500);
    })

    useEffect(() => {
       setCurrentId(id.id);
    }, [id.id]);

    return (
        <>
        {!showEdit?(<div></div>):
        (<div className='container mt-5  d-flex justify-content-center card px-5 py-5' >
            <form className="row g-3" onSubmit={handleSubmit} autoComplete="off">
            <div className="col-md-6">
                <label htmlFor="semster">Select the Semester:</label>
                    <select 
                        name="semester" 
                        id="semester"
                        onChange={handleChange} 
                        value={formData.semester}
                        className="form-select form-select-lg mb-2" 

                    >
                      <option value="">Select a semester</option>
                      {
                          sems?.map((b: SemesterInt)=>(
                            b.status &&
                              <option key={b?.id} value={b?.id}>
                                  {b.season}: {b.year}
                              </option>
                          ))
                      }
                    </select>
                  <label htmlFor="faculty">Select the Faculty:</label>
                    <select 
                        name="faculty" 
                        id="faculty"
                        value={faculties?.find((item)=> item.id === deps?.find((d)=>d.id === formData.department)?.faculty)?.id}
                        onChange={
                            (event)=>{
                                let val = event.target.value as unknown as number
                                const filteredData:any = deps?.filter((d) => d.faculty == val);
                                setDepsD(filteredData);
                            }
                         } 
                        className="form-select form-select-lg mb-2" 

                    >
                      <option value="">Select a faculty</option>
                      {
                          faculties?.map((b: any)=>(
                              <option key={b?.id} value={b?.id}>
                                  {b.shortname}: {b.name}
                              </option>
                          ))
                      }
                    </select>
                  <label htmlFor="department">Select the Department:</label>
                    <select 
                        name="department" 
                        id="department" 
                        onChange={
                            (event)=>{
                                handleChange(event)
                                let val = event.target.value as unknown as number
                                const filteredData:any = progrms?.filter((p) => p.department == val);
                                setProgrmsD(filteredData);
                            }
                         }
                        value={formData.department}
                        
                        className="form-select form-select-lg mb-2"  
                    required>
                      <option value="">Select a department</option>
                      {
                          depsD?.map((b: any)=>(
                              <option key={b?.id} value={b?.id}>
                                  {b.shortname}: {b.name}
                              </option>
                          ))
                      }
                    </select>
                  <label htmlFor="department">Select the Program:</label>
                    <select 
                        name="program" 
                        id="program" 
                        onChange={handleChange} 
                        value={formData.program}
                        className="form-select form-select-lg mb-2"  
                    required>
                      <option value="">Select a program</option>
                      {
                          progrmsD?.map((b: any)=>(
                              <option key={b?.id} value={b?.id}>
                                  {b.shortname}: {b.name}
                              </option>
                          ))
                      }
                    </select>
                  <label htmlFor="semester_number"  className="form-label">Semester Number</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='semester_num'  
                    id='semester_num'
                    placeholder="semester number.." 
                    value={formData.semester_num}
                    onChange={handleChange}
                  />
                  <div className="form-check form-switch">
                    <input className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id="flexSwitchCheckChecked" 
                        name="status"
                        checked = {formData.status}
                        onChange={()=>{setFormData({...formData,status : !formData.status})}}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
                  </div>

                  <label htmlFor="validationCustom01"  className="form-label">Description</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='description'  
                    placeholder="Description..." 
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <button type="submit" className="btn btn-outline-primary btn-lg mt-2 "> Update</button>
                </div>
            </form>
            
        </div>)}
        {
            requestStatus===200?
            (<Alert title={'Updated successfully'} icon={'success'}/>)
            :requestStatus!==0?
                (<RequestHandler status={requestStatus}/>)
            :''
            
        }
        </>
    )
}

const List:React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsloading] = useState(true)
    const [dataChange, setDataChange] = useState(false)
    const [edit, setEdit] = useState(0)
    const [requestHandler, setRequestHandler] = useState(0)
    const dataRef = useRef(data)
    // Fetch data from the server
    useEffect(()=>{
        if(dataChange){
            setData([])
            setIsloading(true)
        }
        setData([])//to remove in production mode

        axiosInstance.get('coursesemester/')
        .then((res:any)=>{
            setData([...data, ...res.data])
            setIsloading(false)
            })
            .catch((err: any)=>{
                setRequestHandler(err.response.status)
            })
            
    },[dataChange]);
    useEffect(()=>{
        setTimeout(() => {
            setRequestHandler(0)
        }, 500);
    },[requestHandler])
    useEffect(()=>{
        setTimeout(() => { 
            if(edit!==0){
                axiosInstance.get('coursesemester/')
                .then((res:any)=>{
                    if(JSON.stringify(dataRef.current)  !== JSON.stringify(res.data)){
                        dataRef.current = res.data
                        setData(res.data)
                    // setDataChange(!dataChange)
                    }
                    })
                    .catch((err: any)=>{
                    })
            }
        }, 2000);
    })
    const [faculties, setFaculties] = useState<FacultyInt[]| null>(null)
    const [deps, setDeps] = useState<DepartmentInt[]| null>(null)
    const [progrms, setProgrms] = useState<ProgramInt[]| null>(null)
    const [sems, setSems] = useState<SemesterInt[]| null>(null)

    useEffect(()=>{
        const getFac = async() =>{
            try {
                const response0 = await axiosInstance.get('program/')
                .then((res)=>{
                    setProgrms(res.data)
                })
                const response2 = await axiosInstance.get('department/')
                .then((res)=>{
                    setDeps(res.data)
                    setDeps(res.data)
                })
                const response = await axiosInstance.get('faculty/')
                .then((res)=>{
                    setFaculties(res.data)
                })
                const response3= await axiosInstance.get('semester/')
                .then((res)=>{
                    setSems(res.data)
                })
            } catch (error) {
                
            }
        }
        getFac()
    },[])

    const listItems = () => {
        return (
            data.map((item) => (
                <tr key={item.id}>
                  <td>{item.semester_num}</td>
                  <td>{progrms?.find(p=>p.id===item.program)?.shortname}</td>
                  <td>{deps?.find(p=>p.id===item.department)?.shortname}</td>
                  <td>{faculties?.find((f)=>f.id===deps?.find((d)=>d.id===item.department)?.faculty)?.shortname}</td>
                  <td>{sems?.find(s=>s.id===item.semester)?.season}:{sems?.find(s=>s.id===item.semester)?.year}</td>
                  <td>{item.status?
                        <button type="button" className="btn btn-outline-primary m-2" >Enable</button>: 
                        <button type="button" className="btn btn-outline-danger m-1">Disable</button>}</td>
                  <td>{item.description}</td>
                  <td>
                    <button onClick={() => setEdit(item.id)} className="btn btn-outline-primary m-2">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-outline-danger m-2">Delete</button>
                  </td>
                </tr>
              ))
        )
    }
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
                    axiosInstance.delete(`/coursesemester/${id}/`)
                    .then(()=>{
                    <Alert title="Item Deleted" icon='success'/>
                    setData(data.filter((val: ProgramInt)=> val.id !== id))
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
    return (
        isLoading ? (<p>Loading...</p>) :
        (<>
            <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">Semester Num</th>
                    <th scope="col">Program</th>
                    <th scope="col">Department</th>
                    <th scope="col">Faculty</th>
                    <th scope="col">Semester</th>
                    <th scope="col">Status</th>
                    <th scope="col">Description</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {listItems()}
            </tbody>
        </table>
        {<RequestHandler status={requestHandler}/>}
        
        {edit !==0? (<Edit id={edit}/>):''}
        </>)
        
    )
}

const CourseSemester = (props:any) => {
    if(props?.type==='create')
    return <Create/>
    if(props?.type==='list')
    return <List/>
    return <div>{props?.type}</div>
    
}

export default CourseSemester
                                                                                                                                                                                                                                                                                                     