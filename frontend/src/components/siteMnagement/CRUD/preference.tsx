import React, { useEffect,useRef,useState } from "react"
import axiosInstance from "../../AxiosInstance"
import RequestHandler from "../../RequestHandler"
import Swal from "sweetalert2"
import {useSelector } from "react-redux"
import Alert from "../../alerts/normalAlert"
import { CourseInt, DepartmentInt, FacultyInt,  PreferenceInt, ProgramInt } from "../../interfaces"
import { Form, Select, Space } from "antd"
import FormItem from "antd/es/form/FormItem"

const Create:React.FC = () => {
    const titlesL = useSelector((state: any)=> state.titles)
    const [perms, setPerms] = useState([])
    const [grps, setGrps] = useState([])
    const [requestStatus, setRequestStatus] = useState(0)
    const [formData, setFormData] = useState<PreferenceInt>({
        id: 0,
        general: 0,
        building: 0,
        floor: 0,
        room: 0,
        faculty: 0,
        department: 0,
        program: 0,
        course_semester: 0,
        semster: 0,
        course: 0,
        type: 0,
        event_type: 0,
        position: 0,
        status: true

    })
    useEffect(()=>{
        document.title = 'Preference Setting'
    })
    useEffect(()=>{
        setTimeout(() => {
            setRequestStatus(0)
        }, 500);
    },[requestStatus])
    interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}
    interface SelectChangeEvent extends React.ChangeEvent<HTMLSelectElement> {}
    interface TextareaChangeEvent extends React.ChangeEvent<HTMLTextAreaElement> {}
    type ChangeEventHandler = (e: InputChangeEvent | SelectChangeEvent | TextareaChangeEvent) => void;


    const handleSubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            console.log(formData)
            const response = await axiosInstance.post('preference/',formData)
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
    const [generals, setGenerals] = useState<any[]>([])
    const [buildings, setBuildings] = useState<any[]>([])
    const [floors, setFloors] = useState<any[]>([])
    const [rooms, setRooms] = useState<any[]>([])
    const [faculties, setFaculties] = useState<FacultyInt[]>([])
    const [deps, setDeps] = useState<DepartmentInt[]>([])
    const [progrms, setProgrms] = useState<ProgramInt[]>([])
    const [courseSemesters, setCourseSemesters] = useState<CourseInt[]>([])
    const [semesters, setSemesters] = useState<CourseInt[]>([])
    const [courses, setCourses] = useState<CourseInt[]>([])
    const [titles, setTitles] = useState<any[]>([])
    const [positions, setPositions] = useState<any>()
    useEffect(()=>{
        const getFac = async() =>{
            try {
                await axiosInstance.get('general/')
                .then((res)=>{
                    setGenerals(res.data)
                })
                await axiosInstance.get('building/')
                .then((res)=>{
                    setBuildings(res.data)
                })
                await axiosInstance.get('floor/')
                .then((res)=>{
                    setFloors(res.data)
                })
                await axiosInstance.get('room/')
                .then((res)=>{
                    setRooms(res.data)
                })
                await axiosInstance.get('faculty/')
                .then((res)=>{
                    setFaculties(res.data)
                })
                await axiosInstance.get('department/')
                .then((res)=>{
                    setDeps(res.data)
                })
                await axiosInstance.get('program/')
                .then((res)=>{
                    setProgrms(res.data)
                })
                await axiosInstance.get('coursesemester/')
                .then((res)=>{
                    setCourseSemesters(res.data)
                })
                await axiosInstance.get('semester/')
                .then((res)=>{
                    setSemesters(res.data)
                })
                await axiosInstance.get('course/')
                .then((res)=>{
                    setCourses(res.data)
                })
                await axiosInstance.get('title/')
                .then((res)=>{
                    setTitles(res.data)
                })
                await axiosInstance.get('title/')
                .then((res)=>{
                    setTitles(res.data)
                })
                
            } catch (error) {
                
            }
        }
        getFac()
        const permissionFetcher= async()=>{
            try {
                const response = await axiosInstance.get('AllGP/')
                console.log(response.data)
                setGrps(response.data.groups)
                setPerms(response.data.permissions)
            } catch (error) {
                setRequestStatus(1)
            }
        }
        permissionFetcher()
    },[])
    const handleFetchChange = async(name:string, value:string) =>{
        if(value==="")return
        const response = await axiosInstance.get(`${name}/?search=${value}`)
        setRequestStatus(response.status)
        switch (name){
            case "generals":
                setGenerals(response.data)
                break
            case 'buildings':
                setBuildings(response.data)
                break
            case 'floors':
                setFloors(response.data)
                break
            case 'rooms':
                setRooms(response.data)
                break
            case 'faculties':
                setFaculties(response.data)
                break
            case 'deps':
                setDeps(response.data)
                break
            case 'progrms':
                setProgrms(response.data)
                break
            case 'courseSemester':
                setCourseSemesters(response.data)
                break
            case 'semesters':
                setSemesters(response.data)
                break
            case 'courses': 
                setCourses(response.data)
                break
            case 'titles':
                setTitles(response.data)
                break
            case 'position':
                setPositions(response.data)
                break
            default:
                return
        }
    }
    return(
        <>
        {
            requestStatus!==0 && (
                requestStatus === 2?<Alert title=" Already exist"  icon={'info'}/>:
                <RequestHandler status={requestStatus}/>
            )
        }
        <div className='container mt-5  d-flex justify-content-center card px-5 py-5' >
            <Space  direction="vertical" size={40}>
                <Form
                    name="preference"
                    initialValues={formData}
                    // onFinish={}
                    // onFinishFailed={}
                    autoComplete="off"
                    layout="horizontal"
                    size="large"
                >
                    <Form.Item<PreferenceInt>
                        label="General"
                        name={'general'}
                        // rules={[
                        //     { required: true, message: 'Please select youe account type' },
                        // ]}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('general',value)}
                            options={generals}
                            defaultValue={[]}
                        >

                        </Select>
                    </Form.Item>
               
                </Form>
            </Space>
        </div>
        </>
    )
}

// const Edit:React.FC<{id:number}> =(id) =>{
//     const [requestStatus, setRequestStatus] = useState(0)
//     const [showEdit, setShowEdit] = useState(true)
//     const titles = useSelector((state: any)=> state.titles)
//     const [perms, setPerms] = useState([])
//     const [grps, setGrps] = useState([])
//     const [formData, setFormData] = useState<LecturerInt>({
//         id: 0,
//         first_name:"",
//         last_name:'',
//         email:'',
//         password:'timetable',
//         username:'',
//         title:0,
//         lecturerid: '',
//         program:null,
//         faculty: null,
//         department:null,
//         is_active: true,
//         group:null,
//         user_permissions:null
//     })
//     const [currentId, setCurrentId] = useState(id.id);
//     useEffect(()=>{
//         document.title = 'Edit Lecturer'
//     },[])

//     useEffect(()=>{
//         axiosInstance.get(`/lecturer/${id.id}/`)
//         .then((res:any)=>{
//         setShowEdit(true)
//         setFormData(res.data)
//             })
//             .catch((err: any)=>{
//                 setRequestStatus(err.response.status)
//             })
//     },[currentId])
//     const [deps, setDeps] = useState<DepartmentInt[]| null>(null)
//     const [depsD, setDepsD] = useState<DepartmentInt[]| null>(null)
//     const [faculties, setFaculties] = useState<FacultyInt[]| null>(null)
//     const [progrms, setProgrms] = useState<ProgramInt[]| null>(null)
//     const [progrmsD, setProgrmsD] = useState<ProgramInt[]| null>(null)
//     const [viewPermissions,setViewPermissions] = useState<Boolean>(false)
//     useEffect(()=>{
//         const getFac = async() =>{
//             try {
//                 const response0 = await axiosInstance.get('program/')
//                 .then((res)=>{
//                     setProgrms(res.data)
//                     setProgrmsD(res.data)
//                 })
//                 const response = await axiosInstance.get('department/')
//                 .then((res)=>{
//                     setDeps(res.data)
//                     setDepsD(res.data)
//                 })
//                 const response2 = await axiosInstance.get('faculty/')
//                 .then((res)=>{
//                     setFaculties(res.data)
//                 })
//             } catch (error) {
                
//             }
//         }
//         getFac()
//         const permissionFetcher= async()=>{
//             try {
//                 const response = await axiosInstance.get('AllGP/')
//                 setGrps(response.data.groups)
//                 setPerms(response.data.permissions)
//             } catch (error) {
//                 setRequestStatus(1)
//             }
//         }
//         permissionFetcher()
//     },[])
    
//     interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}
//     interface SelectChangeEvent extends React.ChangeEvent<HTMLSelectElement> {}
//     interface TextareaChangeEvent extends React.ChangeEvent<HTMLTextAreaElement> {}
//     type ChangeEventHandler = (e: InputChangeEvent | SelectChangeEvent | TextareaChangeEvent) => void;
//     const handleChange: ChangeEventHandler = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         try {
//             const response = await axiosInstance.put(`lecturer/${id.id}/`,formData)
//             setRequestStatus(response.status)
//             setShowEdit(false)
//         } catch (error:any) {
//             try{
//                 if(error.response.status)
//                     setRequestStatus(error.response.status)
//             }catch(error){
//                 setRequestStatus(1)
//             }

//         }
//     }

//     useEffect(()=>{
//         setTimeout(() => {
//             setRequestStatus(0)
//         }, 500);
//     })

//     useEffect(() => {
//        setCurrentId(id.id);
//     }, [id.id]);

//     return (
//         <>
//         {!showEdit?(<div></div>):
//         (<div className='container mt-5  d-flex justify-content-center card px-5 py-5' >
//             <form className="row g-3" onSubmit={handleSubmit} autoComplete="off">
//                 <div className="col-md-6">
//                 <label htmlFor="validationCustom01" className="form-label">First Name</label>
//                   <input 
//                     type="text" 
//                     className="form-control" 
//                     name="first_name" 
//                     placeholder="Eg: Professor" 
//                     value={formData.first_name}
//                     onChange={handleChange}
//                     required
//                   />
//                   <label htmlFor="validationCustom01"  className="form-label">Last Name</label>
//                   <input 
//                     type="text" 
//                     className="form-control"  
//                     name='last_name'  
//                     placeholder="Eg: Prof" 
//                     value={formData.last_name}
//                     onChange={handleChange}
//                     required
//                   />
//                   <label htmlFor="validationCustom01"  className="form-label">Email</label>
//                   <input 
//                     type="email" 
//                     className="form-control"  
//                     name='email'  
//                     placeholder="Eg: Prof" 
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                   <label htmlFor="title">Title:</label>
//                   <select 
//                     name="title" 
//                     id="title" 
//                     onChange={handleChange} 
//                     className="form-select form-select-lg mb-2" 
//                   >
//                     <option value="">Select a tilte</option>
//                     {
//                         titles.map((title: any)=>(
//                             <option key={title?.id} value={title?.id} selected={formData.title === title?.id}>
//                                 {title.name} ({title.shortname})
//                             </option>
//                         ))
//                     }
//                   </select>
//                   <label htmlFor="lecturerid"  className="form-label">Lecturer ID</label>
//                   <input 
//                     type="text" 
//                     className="form-control"
//                     name='lecturerid'  
//                     placeholder="Lecturer Id"
//                     value={formData.lecturerid} 
//                     onChange={handleChange}
//                     required
//                   />
//                   <label htmlFor="group">Select a group:</label>
//                   <select 
//                         name="group" 
//                         id="group"
//                         onChange={ handleChange} 
//                         className="form-select form-select-lg mb-2"
//                     >
//                       <option value="">Select a Group</option>
//                       {
//                           grps?.map((b: any)=>(
//                             <option key={b?.id} value={b?.id} selected={formData.group === b?.id}>
//                              {/* <option key={b?.id} value={b?.id} selected={formData.group?.find((g:any)=>g.id===b.id)}> */}
//                                 {b.name}
//                             </option>
//                           ))
//                       }
//                     </select>
//                     <button 
//                         type="button"  
//                         className="btn btn-primary m-2" 
//                         onClick={()=>{setViewPermissions(!viewPermissions)}}
//                     >
//                         View Permissions
//                     </button><br></br>
//                     {
//                         viewPermissions && 
//                         <select 
//                             name="user_permissions" 
//                             id="user_permissions"
//                             onChange={ handleChange} 
//                             className="form-select form-select-lg mb-2"
//                             multiple
//                         >
//                           <option value="">Select Permissions</option>
//                           {
//                               perms?.map((p: any)=>(
//                                 <option key={p?.id} value={p?.id} selected={formData.user_permissions === p?.id}>
//                                     {p.name}
//                                 </option>
//                               ))
//                           }
//                         </select>
//                     }
//                   <label htmlFor="faculty">Select the Faculty:</label>
//                     <select 
//                         name="faculty" 
//                         id="faculty"
//                         onChange={
//                             (event)=>{
//                                 handleChange(event)
//                                 let val:any = event.target.value
//                                 const filteredData:any = deps?.filter((d) => d.faculty == val);
//                                 setDepsD(filteredData);
//                             }
//                          } 
//                         className="form-select form-select-lg mb-2" 
//                         multiple
//                     >
//                       <option value="">Select a faculty</option>
//                       {
//                           faculties?.map((b: any)=>(
//                             <option key={b?.id} value={b?.id} selected={formData?.faculty?.includes(b?.id)}>
//                                 {b.shortname}: {b.name}
//                             </option>
                          
//                           ))
//                       }
//                     </select>
//                   <label htmlFor="department">Select Department(s):</label>
//                     <select 
//                         name="department" 
//                         id="department" 
//                         onChange={
//                             (event)=>{
//                                 handleChange(event)
//                                 let val:any = event.target.value 
//                                 const filteredData:any = progrms?.filter((p) => p.department == val);
//                                 setProgrmsD(filteredData);
//                             }
//                          }
//                         className="form-select form-select-lg mb-2"  

//                         multiple
//                     required>
//                       <option value="">Select a department(s)</option>
//                       {
//                           depsD?.map((b: any)=>(
//                               <option key={b?.id} value={b?.id} selected={formData?.department?.includes(b?.id)}>
//                                   {b.shortname}: {b.name}
//                               </option>
//                           ))
//                       }
//                     </select>
//                   <label htmlFor="department">Select Program(s):</label>
//                     <select 
//                         name="program" 
//                         id="program" 
//                         onChange={handleChange} 
//                         className="form-select form-select-lg mb-2" 
//                         multiple 
//                     required>
//                       <option value="">Select a program</option>
//                       {
//                           progrmsD?.map((b: any)=>(
//                               <option key={b?.id} value={b?.id} selected={formData?.program?.includes(b?.id)}>
//                                   {b.shortname}: {b.name}
//                               </option>
//                           ))
//                       }
//                     </select>
//                   <div className="form-check form-switch">
//                     <input className="form-check-input" 
//                         type="checkbox" 
//                         role="switch" 
//                         id="flexSwitchCheckChecked" 
//                         name="is_active"
//                         checked = {formData.is_active}
//                         onChange={()=>{setFormData({...formData,is_active : !formData.is_active})}}
//                     />
//                     <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
//                   </div>
//                   <button type="submit" className="btn btn-outline-primary btn-lg mt-2 "> Update </button>
//                 </div>
//             </form>
            
//         </div>)}
//         {
//             requestStatus===200?
//             (<Alert title={'Updated successfully'} icon={'success'}/>)
//             :requestStatus!==0?
//                 (<RequestHandler status={requestStatus}/>)
//             :''
            
//         }
//         </>
//     )
// }

// const List:React.FC = () => {
//     const [data, setData] = useState<any[]>([]);
//     const [isLoading, setIsloading] = useState(true)
//     const [dataChange, setDataChange] = useState(false)
//     const [edit, setEdit] = useState(0)
//     const [requestHandler, setRequestHandler] = useState(0)
//     const [grps, setGrps] = useState<any>([])
//     const dataRef = useRef(data)
//     const [deps, setDeps] = useState<DepartmentInt[]| null>(null)
//     const [depsD, setDepsD] = useState<DepartmentInt[]| null>(null)
//     const [faculties, setFaculties] = useState<FacultyInt[]| null>(null)
//     const [progrms, setProgrms] = useState<ProgramInt[]| null>(null)
//     const [progrmsD, setProgrmsD] = useState<ProgramInt[]| null>(null)
//     const [perms, setPerms] = useState([])
//     const [requestStatus, setRequestStatus] = useState(0)
//     const titles = useSelector((state: any)=> state.titles)

//     // Fetch data from the server
//     useEffect(()=>{
//         if(dataChange){
//             setData([])
//             setIsloading(true)
//         }
//         setData([])//to remove in production mode

//         axiosInstance.get('/lecturer/')
//         .then((res:any)=>{
//             setData([...data, ...res.data])
//             setIsloading(false)
//             })
//             .catch((err: any)=>{
//                 setRequestHandler(err.response.status)
//             })
            
//     },[dataChange]);
//     useEffect(()=>{
//         setTimeout(() => {
//             setRequestHandler(0)
//         }, 500);
//     },[requestHandler])
//     useEffect(()=>{
//         const getFac = async() =>{
//             try {
//                 const response0 = await axiosInstance.get('program/')
//                 .then((res)=>{
//                     setProgrms(res.data)
//                     setProgrmsD(res.data)
//                 })
//                 const response = await axiosInstance.get('department/')
//                 .then((res)=>{
//                     setDeps(res.data)
//                     setDepsD(res.data)
//                 })
//                 const response2 = await axiosInstance.get('faculty/')
//                 .then((res)=>{
//                     setFaculties(res.data)
//                 })
//             } catch (error) {
                
//             }
//         }
//         getFac()
//         const permissionFetcher= async()=>{
//             try {
//                 const response = await axiosInstance.get('AllGP/')
//                 setGrps(response.data.groups)
//                 setPerms(response.data.permissions)
//             } catch (error) {
//                 setRequestStatus(1)
//             }
//         }
//         permissionFetcher()
//     },[])
//     useEffect(()=>{
//         setTimeout(() => { 
//             if(edit!==0){
//                 axiosInstance.get('/lecturer/')
//                 .then((res:any)=>{
//                     if(JSON.stringify(dataRef.current)  !== JSON.stringify(res.data)){
//                         dataRef.current = res.data
//                         setData(res.data)
//                     // setDataChange(!dataChange)
//                     }
//                     })
//                     .catch((err: any)=>{
//                     })
//             }
//         }, 2000);
//     })

//     const listItems = () => {
//         return (
//             data.map((item:any) => (
//                 <tr key={item.id}>
//                   <td>{item.first_name}</td>
//                   <td>{item.last_name}</td>
//                   <td>{titles.find((title:any) => title.id === item.title)?.name || 'Unknown'}</td>
//                   <td>{item.email}</td>
//                   <td>{item.lecturerid}</td>
                  
//                   <td>{grps?.find((v:any )=> v.id == item.group)?.name}</td>
//                   <td>{item.faculty?.map((facultyId:any)=>{return faculties?.find((f:any)=>f.id===facultyId)?.name||'Not Set'})}</td>
//                   {/* <td>{item.faculty.map((f:any) => f.name).join(', ')}</td> */}
//                   {/* <td>{faculties?.find((f:any)=>{return f.id in Object.values(item.faculty)})?.name || "Not Set"}</td> */}

//                   <td>{item.status?
//                         <button type="button" className="btn btn-outline-primary m-2" >Enable</button>: 
//                         <button type="button" className="btn btn-outline-danger m-1">Disable</button>}</td>
//                   <td>
//                     <button onClick={() => setEdit(item.id)} className="btn btn-outline-primary m-2">Edit</button>
//                     <button onClick={() => handleDelete(item.id)} className="btn btn-outline-danger m-2">Delete</button>
//                   </td>
//                 </tr>
//               ))
//         )
//     }
//     function handleDelete(id: number){
//         Swal.fire({
//             title: "Deleting",
//             text: "Do you want to delete this item ?",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             // cancelButtonColor: "#d33",
//             confirmButtonText: "Yes, delete it!"
//           }).then((result:any) => {
//             if (result.isConfirmed) {
//                 try {
//                     axiosInstance.delete(`/lecturer/${id}/`)
//                     .then(()=>{
//                     <Alert title="Item Deleted" icon='success'/>
//                     setData(data.filter((val: LecturerInt)=> val.id !== id))
//                     }).catch((err:any)=>{
//                         try {
//                             <RequestHandler status={err.response.status}/>
//                         } catch (error) {
//                             <RequestHandler status={0}/>
//                         }
//                     });
//                 } catch (error: any) {
//                     console.error("Error in deleting the Item ", error);
//                         <RequestHandler status={error.response.status}/>
//                 }
//             }
//           });
//     }
//     return (
//         isLoading ? (<p>Loading...</p>) :
//         (<>
//             <table className="table table-striped table-hover">
//             <thead>
//                 <tr>
//                     <th scope="col">First Name</th>
//                     <th scope="col">Last Name</th>
//                     <th scope="col">Title</th>
//                     <th scope="col">Email  Address</th>
//                     <th scope="col">Lecturer Id</th>
//                     <th scope="col">Group</th>
//                     <th scope="col">Faculty</th>
//                     <th scope="col">Status</th>
//                     <th scope="col">Actions</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {listItems()}
//             </tbody>
//         </table>
//         {<RequestHandler status={requestHandler}/>}
        
//         {edit !==0? (<Edit id={edit}/>):''}
//         </>)
        
//     )
// }

// const Edit:React.FC<{id:number}> =(id) =>{
//     const navigate = useNavigate()
//     const [requestStatus, setRequestStatus] = useState(0)
//     const [showEdit, setShowEdit] = useState(true)
//     const [formData, setFormData] = useState<FormData>({
//         id:0,
//         floor: 0,
//         code: '',
//         building: 0,
//         description: '',
//         capacity: 0,
//         exm_capacity: 0,
//         usable_for_exm: true,
//         latitude: 0,
//         longitude: 0,
//         room_type: '',
//         state_description: '',
//         status: false
//     })
//     const [currentId, setCurrentId] = useState(id.id);
//     useEffect(()=>{
//         document.title = 'Edit Room'
//     },[])

//     useEffect(()=>{
//         axiosInstance.get(`/room/${id.id}/`)
//         .then((res:any)=>{
//         setShowEdit(true)
//         setFormData(res.data)
//             })
//             .catch((err: any)=>{
//                 setRequestStatus(err.response.status)
//             })
//     },[currentId])
//     const [buildingsData, setBuildingsData] = useState<BuildingInt[]>([])
//     const [floorData, setFloorData] = useState<any[]>([])
//     const [floorDataD, setFloorDataD] = useState([])
//     useEffect(()=>{
//         const  getBuildings = async () => {
//             try {
//                 const response = await axiosInstance.get('building/')
//                 setBuildingsData(response.data)
//                 const response2 = await axiosInstance.get('floor/')
//                 setFloorData(response2.data)
//                 setFloorDataD(response2.data)
//             } catch (error:any) {
//                 try{
//                     if(error.response.status)
//                         setRequestStatus(error.response.status)
//                 }catch(error){
//                     setRequestStatus(1)
//                 }

//             }
//         }
//         getBuildings()
//     },[navigate])

//     interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}
//     interface SelectChangeEvent extends React.ChangeEvent<HTMLSelectElement> {}
//     interface TextareaChangeEvent extends React.ChangeEvent<HTMLTextAreaElement> {}
//     type ChangeEventHandler = (e: InputChangeEvent | SelectChangeEvent | TextareaChangeEvent) => void;
//     const handleChange: ChangeEventHandler = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         try {
//             const response = await axiosInstance.put(`room/${id.id}/`,formData)
//             setRequestStatus(response.status)
//             setShowEdit(false)
//         } catch (error:any) {
//             try{
//                 if(error.response.status)
//                     setRequestStatus(error.response.status)
//             }catch(error){
//                 setRequestStatus(1)
//             }

//         }
//     }

//     useEffect(()=>{
//         setTimeout(() => {
//             setRequestStatus(0)
//         }, 500);
//     })

//     useEffect(() => {
//        setCurrentId(id.id);
//     }, [id.id]);

//     return (
//         <>
//         {!showEdit?(<div></div>):
//         (<div className='container mt-5  d-flex justify-content-center card px-5 py-5' >
//             <form className="row g-3" onSubmit={handleSubmit} autoComplete="off">
//                 <div className="col-md-6">
//                     <label htmlFor="code"  className="form-label">Code</label>
//                     <input 
//                       type="text" 
//                       className="form-control"  
//                       name='code'  
//                       placeholder="Enter the code of the room" 
//                       value={formData.code}
//                       onChange={handleChange}
//                     />
//                     <label htmlFor="building">Select the building:</label>
//                     <select 
//                         name="building" 
//                         id="building"
//                         value={floorData.find((f)=>f.id===formData.floor)?.building}
//                          onChange={
//                             (event)=>{
//                                 let val = event.target.value
//                                 const filteredData:any = floorData.filter((f) => f.building == val);
//                                 setFloorDataD(filteredData);
//                                 let b =  buildingsData.find((bldg)=>bldg.id === parseInt(val))
//                                 formData.longitude = b?b.longitude:0;
//                                 formData.latitude= b?b.latitude:0;
//                                 const longitudeElement = document.getElementById('longitude') as HTMLInputElement;
//                                 longitudeElement !== null?
//                                 longitudeElement.value =( b?b.longitude:0).toString(): console.log('error')
//                                 const latitudeElement = document.getElementById('latitude') as HTMLInputElement;
//                                 latitudeElement !== null ?
//                                 latitudeElement.value=( b?b.latitude:0).toString():console.log('error')
//                             }
//                          } 
//                         className="form-select form-select-lg mb-2" 
//                     >
//                       <option value="">Select a building</option>
//                       {
//                           buildingsData.map((b: any)=>(
//                               <option key={b?.id} value={b?.id}>
//                                   {b.code}: {b.name}
//                               </option>
//                           ))
//                       }
//                     </select>
//                     <label htmlFor="floor">Select the floor:</label>
//                     <select name="floor" 
//                         id="floor" 
//                         onChange={handleChange} 
//                         value={formData.floor}
//                         className="form-select form-select-lg mb-2" 
//                     >
//                         <option value="">Select a Floor</option>
//                       {
//                           floorDataD.map((f: any)=>(
//                               <option key={f?.id} value={f?.id} title={(f.status?'enabled':'disabled')+f.state_description}>
//                                   {f.floor_number}
//                               </option>
//                           ))
//                       }
//                     </select>
//                     <label htmlFor="room_type">Select the type:</label>
//                     <select 
//                         name="room_type" 
//                         id="room_type" 
//                         required onChange={handleChange} 
//                         value={formData.room_type}
//                         className="form-select form-select-lg mb-2" 
//                     >
//                       <option value="">Select a Type</option>
//                       <option value='LEC'>Lecture</option>
//                       <option value='LAB'>Lab</option>
//                       <option value='SEM'>Seminar</option>
//                       <option value='STU'>Studio</option>
//                       <option value='WOR'>Workshop</option>
//                     </select>
//                     <label htmlFor="description"  className="form-label">Description</label>
//                     <input 
//                       type="text" 
//                       className="form-control"  
//                       name='description'  
//                       placeholder="Short description about the room" 
//                       value={formData.description}
//                       onChange={handleChange}
//                     />
//                   <label htmlFor="capacity"  className="form-label">Capacity</label>
//                   <input 
//                     type="number" 
//                     className="form-control"  
//                     name='capacity'  
//                     id='capacity'
//                     placeholder="floor number.." 
//                     value={formData.capacity}
//                     onChange={handleChange}
//                   />
//                   <label htmlFor="exm_capacity"  className="form-label">Exam Capacity</label>
//                   <input 
//                     type="number" 
//                     className="form-control"  
//                     name='exm_capacity'  
//                     id='exm_capacity'
//                     placeholder="floor number.." 
//                     value={formData.exm_capacity}
//                     onChange={handleChange}
//                   />
//                   <div className="form-check form-switch">
//                     <input className="form-check-input" 
//                         type="checkbox" 
//                         role="switch" 
//                         id="usable_for_exm" 
//                         name="usable_for_exm"
//                         checked = {formData.usable_for_exm}
//                         onChange={()=>{setFormData({...formData,usable_for_exm : !formData.usable_for_exm})}}
//                     />
//                     <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
//                   </div>
//                   <label htmlFor="Longitude"  className="form-label">Longitude</label>
//                   <input 
//                     type="number" 
//                     className="form-control"  
//                     name='longitude'  
//                     id='longitude'
//                     placeholder="Longitude.." 
//                     value={formData.longitude}
//                     onChange={handleChange}
//                     disabled
//                   />
//                   <label htmlFor="Latitude"  className="form-label">Latitude</label>
//                   <input 
//                     type="number" 
//                     className="form-control"  
//                     name='Latitude'  
//                     id='latitude'
//                     placeholder="Latitude..." 
//                     value={formData.latitude}
//                     onChange={handleChange}
//                     disabled
//                   />
//                   <div className="form-check form-switch">
//                     <input className="form-check-input" 
//                         type="checkbox" 
//                         role="switch" 
//                         id="flexSwitchCheckChecked" 
//                         name="status"
//                         checked = {formData.status}
//                         onChange={()=>{setFormData({...formData,status : !formData.status})}}
//                     />
//                     <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
//                   </div>

//                   <label htmlFor="validationCustom01"  className="form-label">State Description</label>
//                   <input 
//                     type="text" 
//                     className="form-control"  
//                     name='state_description'  
//                     placeholder="Eg: Why is the state enable or not" 
//                     value={formData.state_description}
//                     onChange={handleChange}
//                   />
//                   <button type="submit" className="btn btn-outline-primary btn-lg mt-2 "> Update</button>
//                 </div>
//             </form>
            
//         </div>)}
//         {
//             requestStatus===200?
//             (<Alert title={'Updated successfully'} icon={'success'}/>)
//             :requestStatus!==0?
//                 (<RequestHandler status={requestStatus}/>)
//             :''
            
//         }
//         </>
//     )
// }

// const List:React.FC = () => {
//     const [data, setData] = useState<any[]>([]);
//     const [isLoading, setIsloading] = useState(true)
//     const [dataChange, setDataChange] = useState(false)
//     const [edit, setEdit] = useState(0)
//     const [requestHandler, setRequestHandler] = useState(0)
//     const dataRef = useRef(data)
//     // Fetch data from the server
//     useEffect(()=>{
//         if(dataChange){
//             setData([])
//             setIsloading(true)
//         }
//         setData([])//to remove in production mode

//         axiosInstance.get('/room/')
//         .then((res:any)=>{
//             setData([...data, ...res.data])
//             setIsloading(false)
//             })
//             .catch((err: any)=>{
//                 setRequestHandler(err.response.status)
//             })
            
//     },[dataChange]);
//     useEffect(()=>{
//         setTimeout(() => {
//             setRequestHandler(0)
//         }, 500);
//     },[requestHandler])
//     useEffect(()=>{
//         setTimeout(() => { 
//             if(edit!==0){
//                 axiosInstance.get('/room/')
//                 .then((res:any)=>{
//                     if(JSON.stringify(dataRef.current)  !== JSON.stringify(res.data)){
//                         dataRef.current = res.data
//                         setData(res.data)
//                     // setDataChange(!dataChange)
//                     }
//                     })
//                     .catch((err: any)=>{
//                     })
//             }
//         }, 2000);
//     })
//     const navigate = useNavigate()
//     const [requestStatus, setRequestStatus] = useState(0)
//     const [buildingsData, setBuildingsData] = useState<BuildingInt[]>([])
//     const [floorData, setFloorData] = useState<any[]>([])
//     useEffect(()=>{
//         const  getBuildings = async () => {
//             try {
//                 const response = await axiosInstance.get('building/')
//                 setBuildingsData(response.data)
//                 console.log(buildingsData)
//             } catch (error:any) {
//                 try{
//                     if(error.response.status)
//                         setRequestStatus(error.response.status)
//                 }catch(error){
//                     setRequestStatus(1)
//                 }

//             }
//         }
//         const getFloors = async ()=>{
//             try {
//                 const response = await axiosInstance.get('floor/')
//                 setFloorData(response.data)
//             } catch (error:any) {
//                 try{
//                     if(error.response.status)
//                         setRequestStatus(error.response.status)
//                 }catch(error){
//                     setRequestStatus(1)
//                 }
//             }
//         }
//         getBuildings()
//         getFloors()
//     },[data])
//     const handleFloor = (id:any)=>{
//         let floorInfo:any = floorData.find((f)=>f.id===id)
//         let building:any = buildingsData.find((b)=>b.id===floorInfo?.building)
//         return  `${building&&building.code}: Floor ${floorInfo&&floorInfo.floor_number}`
//     }
//     const listItems = () => {
//         return (
//             data.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.code}</td>
//                   <td>{handleFloor(item.floor)}</td>
//                   <td>{item.capacity}</td>
//                   <td>{item.exm_capacity}</td>
//                   <td>{item.usable_for_exm?
//                         <button type="button" className="btn btn-outline-primary m-2" >Enable</button>: 
//                         <button type="button" className="btn btn-outline-danger m-1">Disable</button>}</td>
//                   <td>{item.room_type}</td>
//                     <td>{item.status?
//                         <button type="button" className="btn btn-outline-primary m-2" >Enable</button>: 
//                         <button type="button" className="btn btn-outline-danger m-1">Disable</button>}</td>
//                   <td>{item.state_description}</td>
//                   <td>
//                     <button onClick={() => setEdit(item.id)} className="btn btn-outline-primary m-2">Edit</button>
//                     <button onClick={() => handleDelete(item.id)} className="btn btn-outline-danger m-2">Delete</button>
//                   </td>
//                 </tr>
//               ))
//         )
//     }
//     function handleDelete(id: number){
//         Swal.fire({
//             title: "Deleting",
//             text: "Do you want to delete this item ?",
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             // cancelButtonColor: "#d33",
//             confirmButtonText: "Yes, delete it!"
//           }).then((result:any) => {
//             if (result.isConfirmed) {
//                 try {
//                     axiosInstance.delete(`/floor/${id}/`)
//                     .then(()=>{
//                     <Alert title="Item Deleted" icon='success'/>
//                     setData(data.filter((val: FormData)=> val.id !== id))
//                     }).catch((err:any)=>{
//                         try {
//                             <RequestHandler status={err.response.status}/>
//                         } catch (error) {
//                             <RequestHandler status={0}/>
//                         }
//                     });
//                 } catch (error: any) {
//                     console.error("Error in deleting the Item ", error);
//                         <RequestHandler status={error.response.status}/>
//                 }
//             }
//           });
//     }
//     return (
//         isLoading ? (<p>Loading...</p>) :
//         (<>
//             <table className="table table-striped table-hover">
//             <thead>
//                 <tr>
//                     <th scope="col">Code</th>
//                     <th scope="col">Building & Floor</th>
//                     <th scope="col">Capacity</th>
//                     <th scope="col">Exam Capacity</th>
//                     <th scope="col">Usable For Exam</th>
//                     <th scope="col">Room Type</th>
//                     <th scope="col">Status</th>
//                     <th scope="col">State Description</th>
//                     <th scope="col">Actions</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {listItems()}
//             </tbody>
//         </table>
//         {<RequestHandler status={requestHandler}/>}
        
//         {edit !==0? (<Edit id={edit}/>):''}
//         </>)
        
//     )
// }

const Lecturer = (props:any) => {
    if(props?.type==='create')
    return <Create/>
    // if(props?.type==='list')
    // return <List/>
    return <div>{props?.type}</div>
    
}

export default Lecturer
                                                                                                                                                                                                                                                                                                     