import React, { useEffect,useRef,useState } from "react"
import {PrivateDefaultApi} from "../../../utils/AxiosInstance"
import RequestHandler from "../../RequestHandler"
import Swal from "sweetalert2"
import Alert from "../../alerts/normalAlert"
import ImageUpload from "../../forms/ImageUpload"
import FileRetrievalComponent from "../../tools/FileRetrievalComponent"
interface FormData {
    id: number,
    name: string,
    shortname: string,
    color: string,
    icon: any|null,
    description: string
    status: boolean
}

const Create:React.FC = () => {
    const [requestStatus, setRequestStatus] = useState(0)
    const [formData, setFormData] = useState<FormData>({
        id:0,
        name: '',
        shortname: '',
        color: '',
        icon:null,
        description: '',
        status: false
    })
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    useEffect(()=>{
        document.title = 'Faculty Setting'
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
            const response = await PrivateDefaultApi.post('faculty/',formData,{
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
    const handleImageUpload = (imageFile: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(imageFile);
        formData.icon = imageFile
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
                  <label htmlFor="Name"  className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='name'  
                    placeholder="Name of the faculty" 
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <label htmlFor="shortname"  className="form-label">Shortname</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='shortname' 
                    id="shortname"
                    placeholder="Short Name  for the faculty" 
                    value={formData.shortname}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="icon"  className="form-label">Upload an icon (Not compulsory)</label>
                  <ImageUpload onImageUpload={handleImageUpload} ImageData={null}/>
                  {/* {uploadedImage && <img src={uploadedImage} alt="uploaded" style={{ width: '100%' }} />} */}
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
    const [formData, setFormData] = useState<FormData>({
        id:0,
        name: '',
        shortname: '',
        color: '',
        icon:null,
        description: '',
        status: false
    })
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [imageData, setImageData] = useState<any | null>(null)
    const [currentId, setCurrentId] = useState(id.id);
    useEffect(()=>{
        document.title = 'Edit Faculty'
    },[])

    useEffect(()=>{
        PrivateDefaultApi.get(`/faculty/${id.id}/`)
        .then((res:any)=>{
            setShowEdit(true)
            setFormData(res.data)
            setImageData(formData.icon)
            //caution
            const fileData = FileRetrievalComponent({ link: formData.icon });
            const file = new File([fileData as Blob], 'image.jpg', { type: 'image/jpeg' });
            console.log(file)
            handleImageUpload(file);
            //caution
            // if(FileRetrievalComponent(formData.icon) !== null)
                // formData.icon = FileRetrievalComponent(formData.icon)
            })
            .catch((err: any)=>{
                setRequestStatus(err.status)
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
            const response = await PrivateDefaultApi.post('faculty/',formData,{
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
    const handleImageUpload = (imageFile: File) => {
        console.log('hi')
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(imageFile);
        formData.icon = imageFile
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
                    placeholder="Name of the faculty" 
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <label htmlFor="shortname"  className="form-label">Shortname</label>
                  <input 
                    type="text" 
                    className="form-control"  
                    name='shortname' 
                    id="shortname"
                    placeholder="Short Name  for the faculty" 
                    value={formData.shortname}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="icon"  className="form-label">Upload an icon (Not compulsory)</label>
                  <ImageUpload onImageUpload={handleImageUpload} ImageData={null}/>
                  {/* {uploadedImage && <img src={uploadedImage} alt="uploaded" style={{ width: '100%' }} />} */}
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

        PrivateDefaultApi.get('/faculty/')
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
                PrivateDefaultApi.get('/faculty/')
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
                  <td>{item.shortname}</td>
                  {/* <td>{item.color}</td> */}
                  <td><img src={item.icon} alt={item.name} width={50} height={50}/></td>
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
                    PrivateDefaultApi.delete(`/faculty/${id}/`)
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
                    <th scope="col">Shortname</th>
                    {/* <th scope="col">color</th> */}
                    <th scope="col">icon</th>
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

const Faculty = (props:any) => {
    if(props?.type==='create')
    return <Create/>
    if(props?.type==='list')
    return <List/>
    return <div>{props?.type}</div>
    
}

export default Faculty
                                                                                                                                                                                                                                                                                                     