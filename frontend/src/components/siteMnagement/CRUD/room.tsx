import React, { useEffect,useRef,useState } from "react"
import {PrivateDefaultApi} from "../../../utils/AxiosInstance"
import RequestHandler from "../../RequestHandler"
import Swal from "sweetalert2"
import Alert from "../../alerts/normalAlert"
import { useNavigate } from "react-router-dom"

interface FormData {
    id: number
    floor: number
    code: string
    building: number
    description: string
    capacity: number
    exm_capacity: number
    usable_for_exm: boolean
    latitude: number
    longitude: number
    room_type: string
    state_description: string
    status: boolean
}
interface BuildingInt {
    id: number,
    name: string,
    code: string,
    latitude: number,
    longitude: number,
    state_description: string
    status: boolean
}
const Create:React.FC = () => {
    const navigate = useNavigate()
    const [requestStatus, setRequestStatus] = useState(0)
    const [formData, setFormData] = useState<FormData>({
        id:0,
        floor: 0,
        code: '',
        building: 0,
        description: '',
        capacity: 0,
        exm_capacity: 0,
        usable_for_exm: true,
        latitude: 0,
        longitude: 0,
        room_type: '',
        state_description: '',
        status: false
    })
    const [buildingsData, setBuildingsData] = useState<BuildingInt[]>([])
    const [floorData, setFloorData] = useState<any[]>([])
    const [floorDataD, setFloorDataD] = useState([])

    useEffect(()=>{
        document.title = 'Room Settings'
    })
    //Fetching the buildings data
    useEffect(()=>{
        const  getBuildings = async () => {
            try {
                const response = await PrivateDefaultApi.get('building/')
                setBuildingsData(response.data)
                const response2 = await PrivateDefaultApi.get('floor/')
                setFloorData(response2.data)
                setFloorDataD(response2.data)
            } catch (error:any) {
                try{
                    if(error.response.status)
                        setRequestStatus(error.response.status)
                }catch(error){
                    setRequestStatus(1)
                }

            }
        }
        getBuildings()
    },[navigate])

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
            const response = await PrivateDefaultApi.post('room/',formData)
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
                    <label htmlFor="code"  className="form-label">Code</label>
                    <input 
                      type="text" 
                      className="form-control"  
                      name='code'  
                      placeholder="Enter the code of the room" 
                      value={formData.code}
                      onChange={handleChange}
                    />
                    <label htmlFor="building">Select the building:</label>
                    <select 
                        name="building" 
                        id="building"
                        
                         onChange={
                            (event)=>{
                                let val = event.target.value
                                const filteredData:any = floorData.filter((f) => f.building == val);
                                setFloorDataD(filteredData);
                                let b =  buildingsData.find((bldg)=>bldg.id === parseInt(val))
                                formData.longitude = b?b.longitude:0;
                                formData.latitude= b?b.latitude:0;
                                const longitudeElement = document.getElementById('longitude') as HTMLInputElement;
                                longitudeElement !== null?
                                longitudeElement.value =( b?b.longitude:0).toString(): console.log('error')
                                const latitudeElement = document.getElementById('latitude') as HTMLInputElement;
                                latitudeElement !== null ?
                                latitudeElement.value=( b?b.latitude:0).toString():console.log('error')
                            }
                         } 
                        className="form-select form-select-lg mb-2" 
                    >
                      <option value="">Select a building</option>
                      {
                          buildingsData.map((b: any)=>(
                              <option key={b?.id} value={b?.id}>
                                  {b.code}: {b.name}
                              </option>
                          ))
                      }
                    </select>
                    <label htmlFor="floor">Select the floor:</label>
                    <select name="floor" id="floor" onChange={handleChange} className="form-select form-select-lg mb-2" >
                      <option value="">Select a Floor</option>
                      {
                          floorDataD.map((f: any)=>(
                              <option key={f?.id} value={f?.id} title={(f.status?'enabled':'disabled')+f.state_description}>
                                  {f.floor_number}
                              </option>
                          ))
                      }
                    </select>
                    <label htmlFor="room_type">Select the type:</label>
                    <select name="room_type" id="room_type" required onChange={handleChange} className="form-select form-select-lg mb-2" >
                      <option value="">Select a Type</option>
                      <option value='LEC'>Lecture</option>
                      <option value='LAB'>Lab</option>
                      <option value='SEM'>Seminar</option>
                      <option value='STU'>Studio</option>
                      <option value='OFF'>Office</option>
                      <option value='OTH'>Other</option>
                    </select>
                    <label htmlFor="description"  className="form-label">Description</label>
                    <input 
                      type="text" 
                      className="form-control"  
                      name='description'  
                      placeholder="Short description about the room" 
                      value={formData.description}
                      onChange={handleChange}
                    />
                  <label htmlFor="capacity"  className="form-label">Capacity</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='capacity'  
                    id='capacity'
                    placeholder="floor number.." 
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                  <label htmlFor="exm_capacity"  className="form-label">Exam Capacity</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='exm_capacity'  
                    id='exm_capacity'
                    placeholder="floor number.." 
                    value={formData.exm_capacity}
                    onChange={handleChange}
                  />
                  <div className="form-check form-switch">
                    <input className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id="usable_for_exm" 
                        name="usable_for_exm"
                        checked = {formData.usable_for_exm}
                        onChange={()=>{setFormData({...formData,usable_for_exm : !formData.usable_for_exm})}}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Usable for exam (Enable/Disable)</label>
                  </div>
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
                  <label htmlFor="Latitude"  className="form-label">Latitude</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='Latitude'  
                    id='latitude'
                    placeholder="Latitude..." 
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
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Status (Enable/Disable)</label>
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
    const navigate = useNavigate()
    const [requestStatus, setRequestStatus] = useState(0)
    const [showEdit, setShowEdit] = useState(true)
    const [formData, setFormData] = useState<FormData>({
        id:0,
        floor: 0,
        code: '',
        building: 0,
        description: '',
        capacity: 0,
        exm_capacity: 0,
        usable_for_exm: true,
        latitude: 0,
        longitude: 0,
        room_type: '',
        state_description: '',
        status: false
    })
    const [currentId, setCurrentId] = useState(id.id);
    useEffect(()=>{
        document.title = 'Edit Room'
    },[])

    useEffect(()=>{
        PrivateDefaultApi.get(`/room/${id.id}/`)
        .then((res:any)=>{
        setShowEdit(true)
        setFormData(res.data)
            })
            .catch((err: any)=>{
                setRequestStatus(err.response.status)
            })
    },[currentId])
    const [buildingsData, setBuildingsData] = useState<BuildingInt[]>([])
    const [floorData, setFloorData] = useState<any[]>([])
    const [floorDataD, setFloorDataD] = useState([])
    useEffect(()=>{
        const  getBuildings = async () => {
            try {
                const response = await PrivateDefaultApi.get('building/')
                setBuildingsData(response.data)
                const response2 = await PrivateDefaultApi.get('floor/')
                setFloorData(response2.data)
                setFloorDataD(response2.data)
            } catch (error:any) {
                try{
                    if(error.response.status)
                        setRequestStatus(error.response.status)
                }catch(error){
                    setRequestStatus(1)
                }

            }
        }
        getBuildings()
    },[navigate])

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
            const response = await PrivateDefaultApi.put(`room/${id.id}/`,formData)
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
                    <label htmlFor="code"  className="form-label">Code</label>
                    <input 
                      type="text" 
                      className="form-control"  
                      name='code'  
                      placeholder="Enter the code of the room" 
                      value={formData.code}
                      onChange={handleChange}
                    />
                    <label htmlFor="building">Select the building:</label>
                    <select 
                        name="building" 
                        id="building"
                        value={floorData.find((f)=>f.id===formData.floor)?.building}
                         onChange={
                            (event)=>{
                                let val = event.target.value
                                const filteredData:any = floorData.filter((f) => f.building == val);
                                setFloorDataD(filteredData);
                                let b =  buildingsData.find((bldg)=>bldg.id === parseInt(val))
                                formData.longitude = b?b.longitude:0;
                                formData.latitude= b?b.latitude:0;
                                const longitudeElement = document.getElementById('longitude') as HTMLInputElement;
                                longitudeElement !== null?
                                longitudeElement.value =( b?b.longitude:0).toString(): console.log('error')
                                const latitudeElement = document.getElementById('latitude') as HTMLInputElement;
                                latitudeElement !== null ?
                                latitudeElement.value=( b?b.latitude:0).toString():console.log('error')
                            }
                         } 
                        className="form-select form-select-lg mb-2" 
                    >
                      <option value="">Select a building</option>
                      {
                          buildingsData.map((b: any)=>(
                              <option key={b?.id} value={b?.id}>
                                  {b.code}: {b.name}
                              </option>
                          ))
                      }
                    </select>
                    <label htmlFor="floor">Select the floor:</label>
                    <select name="floor" 
                        id="floor" 
                        onChange={handleChange} 
                        value={formData.floor}
                        className="form-select form-select-lg mb-2" 
                    >
                        <option value="">Select a Floor</option>
                      {
                          floorDataD.map((f: any)=>(
                              <option key={f?.id} value={f?.id} title={(f.status?'enabled':'disabled')+f.state_description}>
                                  {f.floor_number}
                              </option>
                          ))
                      }
                    </select>
                    <label htmlFor="room_type">Select the type:</label>
                    <select 
                        name="room_type" 
                        id="room_type" 
                        required onChange={handleChange} 
                        value={formData.room_type}
                        className="form-select form-select-lg mb-2" 
                    >
                      <option value="">Select a Type</option>
                      <option value='LEC'>Lecture</option>
                      <option value='LAB'>Lab</option>
                      <option value='SEM'>Seminar</option>
                      <option value='STU'>Studio</option>
                      <option value='WOR'>Workshop</option>
                    </select>
                    <label htmlFor="description"  className="form-label">Description</label>
                    <input 
                      type="text" 
                      className="form-control"  
                      name='description'  
                      placeholder="Short description about the room" 
                      value={formData.description}
                      onChange={handleChange}
                    />
                  <label htmlFor="capacity"  className="form-label">Capacity</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='capacity'  
                    id='capacity'
                    placeholder="floor number.." 
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                  <label htmlFor="exm_capacity"  className="form-label">Exam Capacity</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='exm_capacity'  
                    id='exm_capacity'
                    placeholder="floor number.." 
                    value={formData.exm_capacity}
                    onChange={handleChange}
                  />
                  <div className="form-check form-switch">
                    <input className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id="usable_for_exm" 
                        name="usable_for_exm"
                        checked = {formData.usable_for_exm}
                        onChange={()=>{setFormData({...formData,usable_for_exm : !formData.usable_for_exm})}}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Enable/Disable</label>
                  </div>
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
                  <label htmlFor="Latitude"  className="form-label">Latitude</label>
                  <input 
                    type="number" 
                    className="form-control"  
                    name='Latitude'  
                    id='latitude'
                    placeholder="Latitude..." 
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

        PrivateDefaultApi.get('/room/')
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
                PrivateDefaultApi.get('/room/')
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
    const navigate = useNavigate()
    const [requestStatus, setRequestStatus] = useState(0)
    const [buildingsData, setBuildingsData] = useState<BuildingInt[]>([])
    const [floorData, setFloorData] = useState<any[]>([])
    useEffect(()=>{
        const  getBuildings = async () => {
            try {
                const response = await PrivateDefaultApi.get('building/')
                setBuildingsData(response.data)
                console.log(buildingsData)
            } catch (error:any) {
                try{
                    if(error.response.status)
                        setRequestStatus(error.response.status)
                }catch(error){
                    setRequestStatus(1)
                }

            }
        }
        const getFloors = async ()=>{
            try {
                const response = await PrivateDefaultApi.get('floor/')
                setFloorData(response.data)
            } catch (error:any) {
                try{
                    if(error.response.status)
                        setRequestStatus(error.response.status)
                }catch(error){
                    setRequestStatus(1)
                }
            }
        }
        getBuildings()
        getFloors()
    },[data])
    const handleFloor = (id:any)=>{
        let floorInfo:any = floorData.find((f)=>f.id===id)
        let building:any = buildingsData.find((b)=>b.id===floorInfo?.building)
        return  `${building&&building.code}: Floor ${floorInfo&&floorInfo.floor_number}`
    }
    const listItems = () => {
        return (
            data.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{handleFloor(item.floor)}</td>
                  <td>{item.capacity}</td>
                  <td>{item.exm_capacity}</td>
                  <td>{item.usable_for_exm?
                        <button type="button" className="btn btn-outline-primary m-2" >Enable</button>: 
                        <button type="button" className="btn btn-outline-danger m-1">Disable</button>}</td>
                  <td>{item.room_type}</td>
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
                    PrivateDefaultApi.delete(`/floor/${id}/`)
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
                    <th scope="col">Code</th>
                    <th scope="col">Building & Floor</th>
                    <th scope="col">Capacity</th>
                    <th scope="col">Exam Capacity</th>
                    <th scope="col">Usable For Exam</th>
                    <th scope="col">Room Type</th>
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

const Room = (props:any) => {
    if(props?.type==='create')
    return <Create/>
    if(props?.type==='list')
    return <List/>
    return <div>{props?.type}</div>
    
}

export default Room
                                                                                                                                                                                                                                                                                                     