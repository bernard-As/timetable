import React, { useEffect,useRef,useState } from "react"
import axiosInstance from "../../AxiosInstance"
import RequestHandler from "../../../components/RequestHandler"
import ListGroup from "react-bootstrap/esm/ListGroup"
import { Row, Col, Button, Navbar, Container, Table } from "react-bootstrap"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import Alert from "../../alerts/normalAlert"
import TokenChecker from "../../../tokenChecker"

interface FormData {
    id: number,
    name: string,
    shortname: string
}

const Create:React.FC = () => {
    const [requestStatus, setRequestStatus] = useState(0)
    const [formData, setFormData] = useState<FormData>({
        id:0,
        name:"",
        shortname:''
    })
    useEffect(()=>{
        document.title = 'Create Title'
    })
    useEffect(()=>{
        setTimeout(() => {
            setRequestStatus(0)
        }, 500);
    },[requestStatus])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('title/',formData)
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
        axiosInstance.get(`/title/${id.id}/`)
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
            const response = await axiosInstance.put(`title/${id.id}/`,formData)
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

const List:React.FC = () => {
    const [data, setData] = useState<FormData[]>([]);
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

        axiosInstance.get('/title/')
        .then((res)=>{
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
                axiosInstance.get('/title/')
                .then((res)=>{
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
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.shortname}</td>
                  <td>
                    <button onClick={() => handleEdit(item.id)} className="btn btn-outline-primary m-2">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-outline-danger m-2">Delete</button>
                  </td>
                </tr>
              ))
        )
    }
    function handleDelete(id: number){
        Swal.fire({
            title: "Deleteing",
            text: "Do you want to delete this item ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            // cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axiosInstance.delete(`/title/${id}/`)
                    .then(()=>{
                    <Alert title="Item Deleted" icon='success'/>
                    setData(data.filter((val: FormData)=> val.id !== id))
                    }).catch((err)=>{
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
            {/* <SearchBar search={setData}/> */}
            <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Short Name</th>
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
const Title = (props:any) => {
    if(props?.type==='create')
    return <Create/>
    if(props?.type==='list')
    return <List/>
    return <div>{props?.type}</div>
    
}

export default Title
                                                                                                                                                                                                                                                                                                     