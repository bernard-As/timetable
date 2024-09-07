import React, { useEffect,useRef,useState } from "react"
import {PrivateDefaultApi} from "../../../utils/AxiosInstance"
import RequestHandler from "../../RequestHandler"
import {useSelector } from "react-redux"
import Alert from "../../alerts/normalAlert"
import Swal from "sweetalert2"

interface FormData {
    id: number
    firstname: string
    lastname: string
    email: string
    username: string
    title:number
    groups: any
    user_permissions: any
}

const Create:React.FC = () => {
    const [requestStatus, setRequestStatus] = useState(0)
    const [formData, setFormData] = useState<FormData>({
        id:0,
        firstname:"",
        lastname:'',
        email:'',
        username:'',
        title:1,
        groups:[],
        user_permissions:[]
    })
    const titles = useSelector((state: any)=> state.titles)
    const [perms, setPerms] = useState([])
    const [grps, setGrps] = useState([])
    useEffect(()=>{
        document.title = 'Create User'
    })
    useEffect(()=>{
        setTimeout(() => {
            setRequestStatus(0)
        }, 500);
    },[requestStatus])
    //Useeffect to get the groups and permission fro the api
    useEffect(()=>{
        const permissionFetcher= async()=>{
            try {
                const response = await PrivateDefaultApi.get('AllGP/')
                console.log(response.data)
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
    type ChangeEventHandler = (e: InputChangeEvent | SelectChangeEvent) => void;
    const handleChange: ChangeEventHandler = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            formData.username = formData.firstname + formData.lastname
            console.log(formData.user_permissions)
            const data = {
                email: formData.email,
                username: formData.username,
                password:'timetable',
                first_name: formData.firstname,
                last_name: formData.lastname,
                title:formData.title,
                groups: formData.groups,
                user_permissions: formData.user_permissions
            }
            const response = await PrivateDefaultApi.post('users/',data)
            setRequestStatus(response.status)
        } catch (error:any) {
            try{
                if(error.response.status)
                    setRequestStatus(error.response.status)
            }catch(error){
                setRequestStatus(1)
            }

        }
    };
    return(
        <>
        {
            requestStatus!==0 && (
                <RequestHandler status={requestStatus}/>
            )
        }
        <div className='container mt-5  d-flex justify-content-center card px-5 py-5' >
            <form className="row g-3" onSubmit={handleSubmit} autoComplete="off">
                <div className="col-md-4">
                  <label htmlFor="validationCustom01" className="form-label">First Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="firstname" 
                    placeholder="Eg: Professor" 
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="validationCustom01"  className="form-label">Last Name</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='lastname'  
                    placeholder="Eg: Prof" 
                    value={formData.lastname}
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
                  <select name="title" id="title" onChange={handleChange} className="form-select form-select-lg mb-2" >
                    <option value="">Select a tilte</option>
                    {
                        titles.map((title: any)=>(
                            <option key={title?.id} value={title?.id}>
                                {title.name} ({title.shortname})
                            </option>
                        ))
                    }
                  </select>
                  <label htmlFor="groups">Groups:</label>
                  <select name="groups" id="groups" 
                    onChange={(e) => {
                        const options = e.target.options;
                        const groups = [];
                        for (let i = 0; i < options.length; i++) {
                          if (options[i].selected) {
                            if (options[i].value === '' || options[i].value==' ')continue
                            groups.push(options[i].value);
                          }
                        }
                        setFormData({ ...formData, groups });
                      }}                 
                      multiple className="form-select form-select-lg mb-2" >
                    <option value='' selected>Select a Group</option>
                    {
                        grps.map((grp: any)=>(
                            <option key={grp?.id} value={grp?.id} title={grp.name}>
                                {grp.name}
                            </option>
                        ))
                    }
                  </select>
                  <label htmlFor="user_permissions">User Permissions:</label>
                  <select name="user_permissions" id="user_permissions" multiple 
                   onChange={(e) => {
                    const options = e.target.options;
                    const user_permissions = [];
                    for (let i = 0; i < options.length; i++) {
                      if (options[i].selected) {
                        if (options[i].value === '' || options[i].value==' ')continue
                        user_permissions.push(options[i].value);
                      }
                    }
                    setFormData({ ...formData, user_permissions });
                  }}  
                  className="form-select form-select-lg mb-2" >
                    <option value='' selected>Select a Permission</option>
                    {
                        perms.map((perm: any)=>(
                            <option key={perm?.id} value={perm?.id} title={perm.name}>
                                {perm.name}
                            </option>
                        ))
                    }
                  </select>
                  <button type="submit" className="btn btn-outline-primary btn-lg mt-2 "> Add</button>
                </div>
            </form>
        </div>
        </>
    )
}

/*const Edit:React.FC<{id:number}> =(id) =>{
    const [requestStatus, setRequestStatus] = useState(0)
    const [showEdit, setShowEdit] = useState(true)
    const [formData, setFormData] = useState<FormData>({
        id:0,
        name:"",
        shortname:''
    })
    const [currentId, setCurrentId] = useState(id.id);
    useEffect(()=>{
        document.title = 'Edit Title'
    },[])

    useEffect(()=>{
        PrivateDefaultApi.get(`/title/${id.id}/`)
        .then((res)=>{
        setShowEdit(true)
        setFormData(res.data)
            })
            .catch((err: any)=>{
                setRequestStatus(err.response.status)
            })
    },[currentId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await PrivateDefaultApi.put(`title/${id.id}/`,formData)
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
                <div className="col-md-4">
                  <label htmlFor="validationCustom01" className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name" 
                    placeholder="Eg: Professor" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="validationCustom01"  className="form-label">Short Name</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='shortname'  
                    placeholder="Eg: Prof" 
                    value={formData.shortname}
                    onChange={handleChange}
                    required
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
*/
const List:React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsloading] = useState(true)
    const [dataChange, setDataChange] = useState(false)
    const [titles, setTitles2] = useState<any[]>([])
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

        PrivateDefaultApi.get('/users/')
        .then((res:any)=>{
            setData([...data, ...res.data])
            setIsloading(false)
            })
            .catch((err: any)=>{
                setRequestHandler(err.response.status)
            })
        PrivateDefaultApi.get('/title/')
        .then((res:any)=>{
            setTitles2([...titles, ...res.data])
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
                PrivateDefaultApi.get('/users/')
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
            data.map((item) => (
                !item.deleted && (<tr key={item.id}>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>{titles && titles.map((titl: any) => (
                        titl.id === item.title ? titl.name : null
                        ))}
                  </td>
                  <td>{item.email}</td>
                  <td>
                    <button onClick={() => handleEdit(item.id)} className="btn btn-outline-primary m-2">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-outline-danger m-2">Delete</button>
                  </td>
                </tr>)
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
          }).then((result) => {
            if (result.isConfirmed) {
                try {
                    PrivateDefaultApi.delete(`/users/${id}/`)
                    .then(()=>{
                    <Alert title="Item Deleted" icon='success'/>
                    setData(data.filter((val: FormData)=> val.id !== id))
                    }).catch((err:any)=>{
                        try {
                            <RequestHandler status={err.response.status}/>
                        } catch (error) {
                            <RequestHandler status={0}/>
                        }
                    });
                } catch (error: any) {
                    console.error("Error in deleting the title ", error);
                        <RequestHandler status={error.response.status}/>
                }
            }
          });
    }
    function handleEdit(id: number){
        setEdit(id)
    }
    return (
        isLoading ? (<p>Loading...</p>) :
        (<>
            
            <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Title</th>
                    <th scope="col">Email</th>
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
const User = (props:any) => {
    if(props?.type==='create')
        return <Create/>
    if(props?.type==='list')
        return <List/>
    return <div>{props?.type}</div>
    
}

export default User
                                                                                                                                                                                                                                                                                                     