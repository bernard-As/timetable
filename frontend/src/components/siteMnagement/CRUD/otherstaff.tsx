import React, { useEffect,useRef,useState } from "react"
import axiosInstance from "../../AxiosInstance"
import RequestHandler from "../../RequestHandler"
import Swal from "sweetalert2"
import {useSelector } from "react-redux"
import Alert from "../../alerts/normalAlert"
import { DepartmentInt, FacultyInt, LecturerInt, OtherStaffInt, ProgramInt } from "../../interfaces"


const Create:React.FC = () => {
    const titles = useSelector((state: any)=> state.titles)
    const [perms, setPerms] = useState([])
    const [grps, setGrps] = useState([])
    const [requestStatus, setRequestStatus] = useState(0)
    const [formData, setFormData] = useState<OtherStaffInt>({
        id: 0,
        first_name:"",
        last_name:'',
        email:'',
        password:'timetable',
        username:'',
        program:null,
        faculty: null,
        department:null,
        status: true,
        group:null,
        user_permissions:null

    })
    useEffect(()=>{
        document.title = 'Other Staff Setting'
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

    const handleChange: ChangeEventHandler = (e) => {
      const { name, value, type } = e.target;

      if (type === 'checkbox') {
        const isChecked = (e.target as HTMLInputElement).checked;
        // Handle checkbox input
        setFormData({ ...formData, [name]: isChecked });
      } else if (type === 'select-multiple') {
        console.log('hi')
        // Handle multiple select
        const selectedOptions = Array.from((e.target as HTMLSelectElement).options)
          .filter((option) => option.selected)
          .map((option) => option.value);
        setFormData({ ...formData, [name]: selectedOptions });
      } else {
        // Handle other input types
        setFormData({ ...formData, [name]: value });
      }
    };


    const handleSubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            formData.username = formData.first_name.replace(' ','')+formData.last_name.replace(' ','')
            console.log(formData)
            const response = await axiosInstance.post('otherstaff/',formData)
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
    return(
        <>
        {
            requestStatus!==0 && (
                requestStatus === 2?<Alert title="Lecturer Id Already exist"  icon={'info'}/>:
                <RequestHandler status={requestStatus}/>
            )
        }
        <div className='container mt-5  d-flex justify-content-center card px-5 py-5' >
            <form className="row g-3" onSubmit={handleSubmit} autoComplete="off">
                <div className="col-md-6">
                <label htmlFor="validationCustom01" className="form-label">First Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="first_name" 
                    placeholder="Eg: Robert" 
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="validationCustom01"  className="form-label">Last Name</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='last_name'  
                    placeholder="Eg: Doe" 
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="validationCustom01"  className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control"  
                    name='email'  
                    placeholder="Eg: Robert.Doe@ee.edu" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="group">Select a group:</label>
                  <select 
                        name="group" 
                        id="group"
                        onChange={ handleChange} 
                        className="form-select form-select-lg mb-2" 
                    >
                      <option value="">Select a Group</option>
                      {
                          grps?.map((b: any)=>(
                            <option key={b?.id} value={b?.id} selected={formData.group === b?.id}>
                                {b.name}
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
                                handleChange(event)
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
                            <option key={b?.id} value={b?.id} selected={formData?.faculty?.includes(b?.id)}>
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
                                handleChange(event)
                                let val:any = event.target.value 
                                const filteredData:any = progrms?.filter((p) => p.department == val);
                                setProgrmsD(filteredData);
                            }
                         }
                        className="form-select form-select-lg mb-2"  

                        multiple
                    required>
                      <option value="">Select a department(s)</option>
                      {
                          depsD?.map((b: any)=>(
                              <option key={b?.id} value={b?.id} selected={formData?.department?.includes(b?.id)}>
                                  {b.shortname}: {b.name}
                              </option>
                          ))
                      }
                    </select>
                  <label htmlFor="department">Select Program(s):</label>
                    <select 
                        name="program" 
                        id="program" 
                        onChange={handleChange} 
                        className="form-select form-select-lg mb-2" 
                        multiple 
                    required>
                      <option value="">Select a program</option>
                      {
                          progrmsD?.map((b: any)=>(
                              <option key={b?.id} value={b?.id} selected={formData?.program?.includes(b?.id)}>
                                  {b.shortname}: {b.name}
                              </option>
                          ))
                      }
                    </select>
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
                  <button type="submit" className="btn btn-outline-primary btn-lg mt-2 "> Add</button>
                </div>
            </form>
        </div>
        </>
    )
}
/*
const Edit:React.FC<{id:number}> =(id) =>{
    const [requestStatus, setRequestStatus] = useState(0)
    const [showEdit, setShowEdit] = useState(true)
    const titles = useSelector((state: any)=> state.titles)
    const [perms, setPerms] = useState([])
    const [grps, setGrps] = useState([])
    const [formData, setFormData] = useState<LecturerInt>({
        id: 0,
        first_name:"",
        last_name:'',
        email:'',
        password:'timetable',
        username:'',
        title:0,
        lecturerid: '',
        program:null,
        faculty: null,
        department:null,
        is_active: true,
        group:null,
        user_permissions:null
    })
    const [currentId, setCurrentId] = useState(id.id);
    useEffect(()=>{
        document.title = 'Edit Lecturer'
    },[])

    useEffect(()=>{
        axiosInstance.get(`/lecturer/${id.id}/`)
        .then((res:any)=>{
        setShowEdit(true)
        setFormData(res.data)
            })
            .catch((err: any)=>{
                setRequestStatus(err.response.status)
            })
    },[currentId])
    const [deps, setDeps] = useState<DepartmentInt[]| null>(null)
    const [depsD, setDepsD] = useState<DepartmentInt[]| null>(null)
    const [faculties, setFaculties] = useState<FacultyInt[]| null>(null)
    const [progrms, setProgrms] = useState<ProgramInt[]| null>(null)
    const [progrmsD, setProgrmsD] = useState<ProgramInt[]| null>(null)
    const [viewPermissions,setViewPermissions] = useState<Boolean>(false)
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
            } catch (error) {
                
            }
        }
        getFac()
        const permissionFetcher= async()=>{
            try {
                const response = await axiosInstance.get('AllGP/')
                setGrps(response.data.groups)
                setPerms(response.data.permissions)
            } catch (error) {
                setRequestStatus(1)
            }
        }
        permissionFetcher()
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
            const response = await axiosInstance.put(`lecturer/${id.id}/`,formData)
            setRequestStatus(response.status)
            setShowEdit(false)
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
                <label htmlFor="validationCustom01" className="form-label">First Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="first_name" 
                    placeholder="Eg: Professor" 
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="validationCustom01"  className="form-label">Last Name</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='last_name'  
                    placeholder="Eg: Prof" 
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="validationCustom01"  className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control"  
                    name='email'  
                    placeholder="Eg: Prof" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="title">Title:</label>
                  <select 
                    name="title" 
                    id="title" 
                    onChange={handleChange} 
                    className="form-select form-select-lg mb-2" 
                  >
                    <option value="">Select a tilte</option>
                    {
                        titles.map((title: any)=>(
                            <option key={title?.id} value={title?.id} selected={formData.title === title?.id}>
                                {title.name} ({title.shortname})
                            </option>
                        ))
                    }
                  </select>
                  <label htmlFor="lecturerid"  className="form-label">Lecturer ID</label>
                  <input 
                    type="text" 
                    className="form-control"
                    name='lecturerid'  
                    placeholder="Lecturer Id"
                    value={formData.lecturerid} 
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="group">Select a group:</label>
                  <select 
                        name="group" 
                        id="group"
                        onChange={ handleChange} 
                        className="form-select form-select-lg mb-2"
                    >
                      <option value="">Select a Group</option>
                      {
                          grps?.map((b: any)=>(
                            <option key={b?.id} value={b?.id} selected={formData.group === b?.id}>
                                {b.name}
                            </option>
                          ))
                      }
                    </select>
                    <button 
                        type="button"  
                        className="btn btn-primary m-2" 
                        onClick={()=>{setViewPermissions(!viewPermissions)}}
                    >
                        View Permissions
                    </button><br></br>
                    {
                        viewPermissions && 
                        <select 
                            name="user_permissions" 
                            id="user_permissions"
                            onChange={ handleChange} 
                            className="form-select form-select-lg mb-2"
                            multiple
                        >
                          <option value="">Select Permissions</option>
                          {
                              perms?.map((p: any)=>(
                                <option key={p?.id} value={p?.id} selected={formData.user_permissions === p?.id}>
                                    {p.name}
                                </option>
                              ))
                          }
                        </select>
                    }
                  <label htmlFor="faculty">Select the Faculty:</label>
                    <select 
                        name="faculty" 
                        id="faculty"
                        onChange={
                            (event)=>{
                                handleChange(event)
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
                            <option key={b?.id} value={b?.id} selected={formData?.faculty?.includes(b?.id)}>
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
                                handleChange(event)
                                let val:any = event.target.value 
                                const filteredData:any = progrms?.filter((p) => p.department == val);
                                setProgrmsD(filteredData);
                            }
                         }
                        className="form-select form-select-lg mb-2"  

                        multiple
                    required>
                      <option value="">Select a department(s)</option>
                      {
                          depsD?.map((b: any)=>(
                              <option key={b?.id} value={b?.id} selected={formData?.department?.includes(b?.id)}>
                                  {b.shortname}: {b.name}
                              </option>
                          ))
                      }
                    </select>
                  <label htmlFor="department">Select Program(s):</label>
                    <select 
                        name="program" 
                        id="program" 
                        onChange={handleChange} 
                        className="form-select form-select-lg mb-2" 
                        multiple 
                    required>
                      <option value="">Select a program</option>
                      {
                          progrmsD?.map((b: any)=>(
                              <option key={b?.id} value={b?.id} selected={formData?.program?.includes(b?.id)}>
                                  {b.shortname}: {b.name}
                              </option>
                          ))
                      }
                    </select>
                  <div className="form-check form-switch">
                    <input className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id="flexSwitchCheckChecked" 
                        name="is_active"
                        checked = {formData.is_active}
                        onChange={()=>{setFormData({...formData,is_active : !formData.is_active})}}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
                  </div>
                  <button type="submit" className="btn btn-outline-primary btn-lg mt-2 "> Update </button>
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
*/
const List:React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsloading] = useState(true)
    const [dataChange, setDataChange] = useState(false)
    const [edit, setEdit] = useState(0)
    const [requestHandler, setRequestHandler] = useState(0)
    const [grps, setGrps] = useState<any>([])
    const dataRef = useRef(data)
    const [deps, setDeps] = useState<DepartmentInt[]| null>(null)
    const [depsD, setDepsD] = useState<DepartmentInt[]| null>(null)
    const [faculties, setFaculties] = useState<FacultyInt[]| null>(null)
    const [progrms, setProgrms] = useState<ProgramInt[]| null>(null)
    const [progrmsD, setProgrmsD] = useState<ProgramInt[]| null>(null)
    const [perms, setPerms] = useState([])
    const [requestStatus, setRequestStatus] = useState(0)
    const titles = useSelector((state: any)=> state.titles)

    // Fetch data from the server
    useEffect(()=>{
        if(dataChange){
            setData([])
            setIsloading(true)
        }
        setData([])//to remove in production mode

        axiosInstance.get('/otherstaff/')
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
            } catch (error) {
                
            }
        }
        getFac()
        const permissionFetcher= async()=>{
            try {
                const response = await axiosInstance.get('AllGP/')
                setGrps(response.data.groups)
                setPerms(response.data.permissions)
            } catch (error) {
                setRequestStatus(1)
            }
        }
        permissionFetcher()
    },[])
    useEffect(()=>{
        setTimeout(() => { 
            if(edit!==0){
                axiosInstance.get('/otherstaff/')
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

    const listItems = () => {
        return (
            data.map((item:any) => (
                <tr key={item.id}>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>{item.email}</td>
                  <td>{grps?.find((v:any )=> v.id == item.group)?.name}</td>
                  <td>{item.faculty?.map((facultyId:any)=>{return faculties?.find((f:any)=>f.id===facultyId)?.name||'Not Set'})}</td>

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
                    axiosInstance.delete(`/otherstaff/${id}/`)
                    .then(()=>{
                    <Alert title="Item Deleted" icon='success'/>
                    setData(data.filter((val: LecturerInt)=> val.id !== id))
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
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email  Address</th>
                    <th scope="col">Group</th>
                    <th scope="col">Faculty</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {listItems()}
            </tbody>
        </table>
        {<RequestHandler status={requestHandler}/>}
        
        {/* {edit !==0? (<Edit id={edit}/>):''} */}
        </>)
        
    )
}

const OtherStaff = (props:any) => {
    if(props?.type==='create')
    return <Create/>
    if(props?.type==='list')
    return <List/>
    return <div>{props?.type}</div>
    
}

export default OtherStaff
                                                                                                                                                                                                                                                                                                      