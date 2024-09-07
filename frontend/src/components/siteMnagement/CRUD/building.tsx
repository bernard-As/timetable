import React, { useEffect,useRef,useState } from "react"
import {PrivateDefaultApi} from "../../../utils/AxiosInstance"
import RequestHandler from "../../RequestHandler"
import Swal from "sweetalert2"
import Alert from "../../alerts/normalAlert"
interface FormData {
    id: number,
    name: string,
    code: string,
    latitude: number,
    longitude: number,
    state_description: string
    status: boolean
}

const Create:React.FC = () => {
    const [requestStatus, setRequestStatus] = useState(0)
    const [formData, setFormData] = useState<FormData>({
        id:0,
        name: '',
        code: '',
        latitude: 0,
        longitude: 0,
        state_description: '',
        status: false
    })
    useEffect(()=>{
        document.title = 'Building Setting'
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit =async  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await PrivateDefaultApi.post('building/',formData)
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
                <div className="col-md-6">
                  <label htmlFor="Name"  className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='name'  
                    placeholder="Name of the building" 
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <label htmlFor="Code"  className="form-label">Code</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='code'  
                    placeholder="Code of the building" 
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="">Use the following link in order to retreive the longitude and latitude :
                     <a href=""
                     onClick={()=>{
                        window.open("https://www.google.com/maps/",
                                "", "width=800, height=800");
                        }}
                     >Map</a></label>
                  <label htmlFor=""  className="form-label">Paste the content here</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name=''  
                    placeholder="Here..." 
                    onChange={(event) => {
                      const coordinates = event.target.value.split(',');
                      formData.longitude = Number(coordinates[0]);
                        const longitudeElement = document.getElementById('longitude') as HTMLInputElement;
                        longitudeElement !== null?
                        longitudeElement.value = Number(coordinates[0]).toString():console.log('error')
                      formData.latitude = Number(coordinates[1]);
                        const latitudeElement = document.getElementById('latitude') as HTMLInputElement;
                        latitudeElement !== null ?
                        latitudeElement.value=Number(coordinates[1]).toString() : console.log('error') ;
                    }}
                  />

                  <label htmlFor="Longitude"  className="form-label">Longitude</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='longitude'  
                    id='longitude'
                    placeholder="Longitude.." 
                    value={formData.longitude}
                    onChange={handleChange}
                    disabled
                  />
                  <label htmlFor="Latutude"  className="form-label">Latutude</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='latutude'  
                    id='latitude'
                    placeholder="Latutude..." 
                    value={formData.latitude}
                    onChange={handleChange}
                    disabled
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

                  <label htmlFor="validationCustom01"  className="form-label">State Description</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='state_description'  
                    placeholder="Eg: Why is the state enable or not" 
                    value={formData.state_description}
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
    const [formData, setFormData] = useState<FormData>({
        id:0,
        name: '',
        code: '',
        latitude: 0,
        longitude: 0,
        state_description: '',
        status: false
    })
    const [currentId, setCurrentId] = useState(id.id);
    useEffect(()=>{
        document.title = 'Edit Building'
    },[])

    useEffect(()=>{
        PrivateDefaultApi.get(`/building/${id.id}/`)
        .then((res:any)=>{
        setShowEdit(true)
        setFormData(res.data)
            })
            .catch((err: any)=>{
                setRequestStatus(err.response.status)
            })
    },[currentId])

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
            const response = await PrivateDefaultApi.put(`building/${id.id}/`,formData)
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
                  <label htmlFor="Name"  className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='name'  
                    placeholder="Name of the building" 
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <label htmlFor="Code"  className="form-label">Code</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='code'  
                    placeholder="Code of the building" 
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="">Use the following link in order to retreive the longitude and latitude :
                     <a href=""
                     onClick={()=>{
                        window.open(`https://www.google.com/maps?q=${formData.longitude+', '+formData.latitude}`,
                                "", "width=800, height=800");
                    }}
                     >Map</a></label>
                  <label htmlFor=""  className="form-label">Paste the content here</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name=''  
                    // value={formData.longitude+', '+formData.latitude}
                    placeholder="Here..." 
                    onChange={(event) => {
                      const coordinates = event.target.value.split(',');
                      formData.longitude = Number(coordinates[0]);
                        const longitudeElement = document.getElementById('longitude') as HTMLInputElement;
                        longitudeElement !== null?
                        longitudeElement.value = Number(coordinates[0]).toString():console.log('error')
                      formData.latitude = Number(coordinates[1]);
                        const latitudeElement = document.getElementById('latitude') as HTMLInputElement;
                        latitudeElement !== null ?
                        latitudeElement.value=Number(coordinates[1]).toString() : console.log('error') ;
                    }}
                  />

                  <label htmlFor="Longitude"  className="form-label">Longitude</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='longitude'  
                    id='longitude'
                    placeholder="Longitude.." 
                    value={formData.longitude}
                    onChange={handleChange}
                    disabled
                  />
                  <label htmlFor="Latutude"  className="form-label">Latutude</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='latutude'  
                    id='latitude'
                    placeholder="Latutude..." 
                    value={formData.latitude}
                    onChange={handleChange}
                    disabled
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

                  <label htmlFor="validationCustom01"  className="form-label">State Description</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='state_description'  
                    placeholder="Eg: Why is the state enable or not" 
                    value={formData.state_description}
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

        PrivateDefaultApi.get('/building/')
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
                PrivateDefaultApi.get('/building/')
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
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.code}</td>
                  <td><a href=""
                    onClick={()=>{
                        window.open(`https://www.google.com/maps?q=${item.longitude+', '+item.latitude}`,
                                "", "width=800, height=800");
                    }}
                  >View in the map</a></td>
                  <td>{item.status?
                        <button type="button" className="btn btn-outline-primary m-2" >Enable</button>: 
                        <button type="button" className="btn btn-outline-danger m-1">Disable</button>}</td>
                  <td>{item.state_description}</td>
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
                    PrivateDefaultApi.delete(`/building/${id}/`)
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
                    <th scope="col">Name</th>
                    <th scope="col">Code</th>
                    <th scope="col">Coordinates</th>
                    <th scope="col">Status</th>
                    <th scope="col">State Description</th>
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

const Building = (props:any) => {
    if(props?.type==='create')
    return <Create/>
    if(props?.type==='list')
    return <List/>
    return <div>{props?.type}</div>
    
}

export default Building
                                                                                                                                                                                                                                                                                                     