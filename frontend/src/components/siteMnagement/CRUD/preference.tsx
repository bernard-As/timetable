import React, { useEffect,useRef,useState } from "react"
import axiosInstance from "../../AxiosInstance"
import RequestHandler from "../../RequestHandler"
import Swal from "sweetalert2"
import {useSelector } from "react-redux"
import Alert from "../../alerts/normalAlert"
import { CourseGroupInt, CourseInt, CourseSemesterInt, DepartmentInt, FacultyInt,  PreferenceInt, ProgramInt, SemesterInt } from "../../interfaces"
import { Button, Checkbox, DatePicker, Form, FormProps, Input, Rate, Select, Slider, Space, Switch, TimePicker, message } from "antd"
import FormItem from "antd/es/form/FormItem"
import { LiaSpinnerSolid } from "react-icons/lia";
import TextArea from "antd/es/input/TextArea"
import dayjs from "dayjs"

const Create:React.FC = () => {
    const titlesL = useSelector((state: any)=> state.titles)
    const [perms, setPerms] = useState([])
    const [grps, setGrps] = useState([])
    const [requestStatus, setRequestStatus] = useState(0)
    const [formData, setFormData] = useState<PreferenceInt>({
        id: 0,
        general: [],
        building: [],
        floor: [],
        room: [],
        faculty: [],
        department: [],
        program: [],
        course_semester: [],
        semester: [],
        course: [],
        type: [],
        event_type: [],
        position: [],
        preference:[],
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
    const [semesters, setSemesters] = useState<SemesterInt[]>([])
    const [courses, setCourses] = useState<CourseInt[]>([])
    const [titles, setTitles] = useState<any[]>([])
    const [preference, setPreference] = useState<PreferenceInt[]>([])
    const [courseSemesters, setCourseSemesters] = useState<CourseSemesterInt[]>([])
    const [generalsD, setGeneralsD] = useState<any[]>([])
    const [buildingsD, setBuildingsD] = useState<any[]>([])
    const [floorsD, setFloorsD] = useState<any[]>([])
    const [roomsD, setRoomsD] = useState<any[]>([])
    const [facultiesD, setFacultiesD] = useState<FacultyInt[]>([])
    const [depsD, setDepsD] = useState<DepartmentInt[]>([])
    const [progrmsD, setProgrmsD] = useState<ProgramInt[]>([])
    const [courseSemestersD, setCourseSemestersD] = useState<CourseSemesterInt[]>([])
    const [semestersD, setSemestersD] = useState<SemesterInt[]>([])
    const [coursesD, setCoursesD] = useState<CourseInt[]>([])
    const [titlesD, setTitlesD] = useState<any[]>([])
    const [courseGroup, setCourseGroup] = useState<CourseGroupInt[]>([])
    const [courseGroupD, setCourseGroupD] = useState<CourseGroupInt[]>([])
    const [preferenceD, setPreferenceD] = useState<PreferenceInt[]>([])
    const [positions, setPositions] = useState<any>()
    const [loading, setLoading] = useState(false)
    useEffect(()=>{
        const getFac = async() =>{
            try {
                await axiosInstance.get('general/')
                .then((res)=>{
                    setGenerals(res.data)
                    setGeneralsD(res.data)
                    setLoading(true)
                })
                await axiosInstance.get('building/')
                .then((res)=>{
                    setBuildings(res.data)
                    setBuildingsD(res.data)
                })
                await axiosInstance.get('floor/')
                .then((res)=>{
                    setFloors(res.data)
                    setFloorsD(res.data)
                })
                await axiosInstance.get('room/')
                .then((res)=>{
                    setRooms(res.data)
                    setRoomsD(res.data)
                })
                await axiosInstance.get('faculty/')
                .then((res)=>{
                    setFaculties(res.data)
                    setFacultiesD(res.data)
                })
                await axiosInstance.get('department/')
                .then((res)=>{
                    setDeps(res.data)
                    setDepsD(res.data)
                })
                await axiosInstance.get('program/')
                .then((res)=>{
                    setProgrms(res.data)
                    setProgrmsD(res.data)
                })
                await axiosInstance.get('coursesemester/')
                .then((res)=>{
                    setCourseSemesters(res.data)
                    setCourseSemestersD(res.data)
                })
                await axiosInstance.get('semester/')
                .then((res)=>{
                    setSemesters(res.data)
                    setSemestersD(res.data)
                })
                await axiosInstance.get('course/')
                .then((res)=>{
                    setCourses(res.data)
                    setCoursesD(res.data)
                })
                await axiosInstance.get('coursegroup/')
                .then((res)=>{
                    setCourseGroup(res.data)
                    setCourseGroupD(res.data)
                })
                await axiosInstance.get('title/')
                .then((res)=>{
                    setTitles(res.data)
                    setTitlesD(res.data)
                })
                await axiosInstance.get('preference/')
                .then((res)=>{
                    setPreference(res.data)
                    setPreferenceD(res.data)
                })
                await axiosInstance.get('title/')
                .then((res)=>{
                    setTitles(res.data)
                    setTitlesD(res.data)
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
        setLoading(false)
        if(value==="")return
        const response = await axiosInstance.get(`${name}/?search=${value}`)
        console.info(name)
        switch (name){
            case "general":
                setGeneralsD(response.data)
                setLoading(true)
                break
            case 'building':
                setBuildingsD(response.data)
                break
            case 'floor':
                setFloorsD(response.data)
                break
            case 'room':
                setRoomsD(response.data)
                break
            case 'faculty':
                setFacultiesD(response.data)
                break
            case 'department':
                setDepsD(response.data)
                break
            case 'program':
                setProgrmsD(response.data)
                break
            case 'coursesemester':
                setCourseSemestersD(response.data)
                break
            case 'semester':
                setSemestersD(response.data)
                break
            case 'coursegroup': 
                setCourseGroupD(response.data)
                break
            case 'title':
                setTitlesD(response.data)
                break
            case 'course':
                setCourses(response.data)
                break
            case 'preference':
                setPreferenceD(response.data)
                break
            case 'position':
                setPositions(response.data)
                break
            default:
                return
        }
    }

    const onFinish:FormProps<PreferenceInt>['onFinish'] = async (values) =>{
        try{
            const response = await axiosInstance.post('preference/',values)
            setRequestStatus(response.status)
        }catch(error:any){
            try{
                if(error.response.status){
                    try {
                        if(error.response.status === 400)
                        setRequestStatus(2)
                    } catch (err) {
                        setRequestStatus(error.response.status)
                        message.error('Submission failed',5)
                    }
                    setRequestStatus(error.response.status)
                    message.error('Submission failed',5)
                }
            }catch(error){
                setRequestStatus(1)
            }
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
            <Space  direction="vertical" >
                <Form
                    name="preference"
                    // initialValues={formData}
                    onFinish={onFinish}
                    onFinishFailed={()=>{setRequestStatus(1)}}
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
                            optionFilterProp="children"
                            filterOption = {false}
                            options={
                                generalsD.map((g)=>{return {value:g.id,label:g.description}} )
                            }
                        >
                        </Select>
                    </Form.Item>

                    <Form.Item<PreferenceInt>
                        label="Building"
                        name={'building'}
                        // rules={[
                        //     { required: true, message: 'Please select youe account type' },
                        // ]}
                    >
                        
                        <Select
                            mode="multiple"
                            allowClear
                            autoClearSearchValue
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('building',value)}
                            optionFilterProp="children"
                            filterOption = {false}
                            // onChange={(value)=>handleFetchChange('building',value)}
                        >
                            {buildingsD.map((item)=>{
                                return <Select.Option key={item.id} value={item.id}>{item.code&&item.code} {item.name}</Select.Option>
                            }
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item<PreferenceInt>
                        label="Floor"
                        name={'floor'}
                        // rules={[
                        //     { required: true, message: 'Please select youe account type' },
                        // ]}
                    >
                        
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('floor',value)}
                            optionFilterProp="children"
                            filterOption = {false}
                        >
                            {floorsD.map((item)=>{
                                return <Select.Option key={item.id} value={item.id}>
                                    Floor {item.floor_number} - {buildings.find(b=>b.id=== item.building)?.name}
                                </Select.Option>
                            }
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item<PreferenceInt>
                        label="Room"
                        name={'room'}
                        // rules={[
                        //     { required: true, message: 'Please select youe account type' },
                        // ]}
                    >
                        
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('room',value)}
                            optionFilterProp="children"
                            filterOption = {false}

                        >
                            {roomsD.map((item)=>{
                                return <Select.Option value={item.id} key={item.id}>
                                    {item.code&&item.code} - Floor 
                                    {floors.find(f=>f.id===item.floor)?.number}
                                    : {buildings.find(b=>b.id===(floors.find(f=>f.id===item.floor).building))?.name}
                                    </Select.Option>
                            }
                            )}
                        </Select>
                    </Form.Item>

                    <Form.Item<PreferenceInt>
                        label="Faculty"
                        name={'faculty'}
                        // rules={[
                        //     { required: true, message: 'Please select youe account type' },
                        // ]}
                    >
                        
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('faculty',value)}
                            optionFilterProp="children"
                            filterOption = {false}

                        >
                            {facultiesD.map((item)=>{
                                return <Select.Option key={item.id}  value={item.id}>{item.shortname&&item.shortname} {item.name}</Select.Option>
                            }
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item<PreferenceInt>
                        label="Departement"
                        name={'department'}
                        // rules={[
                        //     { required: true, message: 'Please select youe account type' },
                        // ]}
                    >
                        
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('department',value)}
                            optionFilterProp="children"
                            filterOption = {false}

                        >
                            {depsD.map((item)=>{
                                return <Select.Option key={item.id} value={item.id}>
                                    {item.shortname&&item.shortname}
                                    - Faculty:  
                                    {faculties.find(b=>b.id===item.faculty)?.name}
                                </Select.Option>
                            }
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item<PreferenceInt>
                        label="Program"
                        name={'program'}
                        // rules={[
                        //     { required: true, message: 'Please select youe account type' },
                        // ]}
                    >
                        
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('program',value)}
                            optionFilterProp="children"
                            filterOption = {false}

                        >
                            {progrmsD.map((item)=>{
                                return <Select.Option value={item.id} key={item.id}>
                                        {item.shortname&&item.shortname} - Department:
                                        {deps.find(d=>d.id===item.department)?.name} - Faculty:
                                        {faculties.find(f=>f.id===(deps.find(d=>d.id===item.department)?.faculty))?.name}
                                    </Select.Option>
                            }
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item<PreferenceInt>
                        label="Course Semester"
                        name={'course_semester'}
                        // rules={[
                        //     { required: true, message: 'Please select youe account type' },
                        // ]}
                    >
                        
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('coursesemester',value)}
                            optionFilterProp="children"
                            filterOption = {false}

                        >
                            {courseSemestersD.map((item)=>{
                                return <Select.Option value={item.id} key={item.id}>
                                    {`Semester ${item.semester_num}: `}
                                    {faculties.find(f=>f.id===(deps.find(d=>d.id===item.department)?.faculty))?.name}{` - `}
                                    {deps.find(d=>d.id===item.department)?.name}{` - `} 
                                    {progrms.find(p=>p.id===item.program)?.name}{` - `} 
                                    {semesters.find(s=>s.id===item.semester)?.season}{` - `} 
                                    {semesters.find(s=>s.id===item.semester)?.year}
                                    </Select.Option>
                            }
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item<PreferenceInt>
                        label="Semester"
                        name={'semester'}
                        // rules={[
                        //     { required: true, message: 'Please select youe account type' },
                        // ]}
                    >
                        
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('semester',value)}
                            optionFilterProp="children"
                            filterOption = {false}

                        >
                            {
                                semestersD.map((item)=>
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.season+' - '+ item.year}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item<PreferenceInt>
                        label="Course"
                        name={'course'}
                    >
                        
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('course',value)}
                            optionFilterProp="children"
                            filterOption = {false}

                        >
                            {
                                courses.map((item)=>
                                    <Select.Option value={item.id} key={item.id}>
                                        {courses.find(c=>c.id===item.id)?.code}:{` - `}
                                        {courses.find(c=>c.id===item.id)?.title}{` - `}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item<PreferenceInt>
                        label="Course Group"
                        name={'coursegroup'}
                    >
                        
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('coursegroup',value)}
                            optionFilterProp="children"
                            filterOption = {false}

                        >
                            {
                                courseGroupD.map((item)=>
                                    <Select.Option value={item.id} key={item.id}>
                                        {courses.find(c=>c.id===item.course)?.code}:{` - `}
                                        {courses.find(c=>c.id===item.course)?.title}{` - `}
                                        G{item.group_number}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    
                    <Form.Item<PreferenceInt>
                        label="Preference"
                        name={'preference'}
                    >
                        
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('preference',value)}
                            optionFilterProp="children"
                            filterOption = {false}

                        >
                            {
                                preferenceD.map((item)=>
                                    <Select.Option value={item.id} key={item.id}>
                                        General: {item.general?.map(i=>generals.find(g=>g.id==i)?.description).join(", ")} - 
                                        Building: {item.building?.map(b=>buildings.find(g=>g.id===b)?.name).join(", ")} - 
                                        Floor: {item.floor?.map(f=>{
                                            const x = floors.find(f2=>f2.id===f2)
                                            const xb = buildings.find(b=>x?.building)
                                            return xb?.code + ` ` + xb?.code + ` ` + x?.floor_number
                                        }).join(", ")}
                                        <br />
                                        Room: {item.room?.map(r=>{
                                            const x = rooms.find(b=>b.id===r)
                                            const xf = floors.find(f=>f.id===x.floor)
                                            const xb = buildings.find(b=>xf.building === b.id)
                                            return `${x?.code} F ${xf?.floor_number} B ${xb?.code} ${xb?.name}`
                                        }).join(", ")}
                                        <br />
                                        Faculty: {item.faculty?.map(f=>{
                                            const  x = faculties.find(i=>i.id===f)
                                            return x ? x.shortname + ' '+ x.name : ''
                                        }).join(", ")}
                                        <br />
                                        Derpartment: {item.department?.map(d=>{
                                            const x = deps.find(i=>i.id===d)
                                            const xf = faculties.find(f=>f.id===x?.faculty)
                                            return `${x?.shortname} ${x?.name} F ${xf?.shortname}`
                                        })}
                                        Program: {item.program?.map(p=>{
                                            const x = progrms.find(i=>i.id===p)
                                            const xd = deps.find(f=>f.id===x?.department)
                                            const xf = faculties.find(f=>f.id===xd?.faculty)
                                            return `${x?.name} ${x?.shortname} D ${xd?.name} ${xd?.shortname} F ${xf?.name} ${xf?.shortname}}`
                                        })}
                                        Course Semester: {item.course_semester?.map(c=>{
                                            const x = courseSemesters.find(d=>d.id===c)
                                            const xp = progrms.find(p=>p.id===x?.program)
                                            const xd = deps.find(f=>f.id===xp?.department)
                                            const xf = faculties.find(f=>f.id===xd?.faculty)
                                            return `${x?.semester_num } P ${xp?.shortname} D ${xd?.shortname} F ${xf?.shortname}`
                                        })}
                                        Semester : {item.semester?.map(s=>{
                                            const x = semesters.find(e=>e.id===s)
                                            return `${x?.season}  year ${x?.year}`
                                        })}
                                        Course: {item.course?.map(c=>{
                                            const  x = courses.find(e=>e.id===c)
                                            return `${x?.code} ${x?.title}`
                                        })}
                                        Course Group: {}

                                    </Select.Option>
                                )
                            }
                        </Select>
                        
                    </Form.Item>

                    <Form.Item label="Title" name={"title"}>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            onSearch={(value)=>handleFetchChange('title',value)}
                            optionFilterProp="children"
                            filterOption = {false}

                        >
                            {
                                titlesD.map((item)=>
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}:{` - `}
                                        {item.shortname}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item label="Status" valuePropName="checked" name={"status"}>
                      <Switch defaultChecked={true}/>
                    </Form.Item>

                    <Form.Item label="Type(Indicating the nature positive negative or neutral)"  name={"type"}>
                      <Slider  step={1} defaultValue={0} max={1} min={-1} style={{width:400}}/>
                    </Form.Item>
                    <Form.Item label="Description"  name={"description"}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Start Time"  name={"start"}>
                        <TimePicker  format="HH:mm" minuteStep={15}  value={dayjs('HH:mm')} />                    
                    </Form.Item>
                    <Form.Item label="End Time"  name={"end"}>
                        <TimePicker  format="HH:mm" minuteStep={15}  value={dayjs('HH:mm')} />                    
                    </Form.Item>
                    <Form.Item label="Date"  name={"date"}>
                        <DatePicker/>                    
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form>
            </Space>
        </div>
        </>
    )
}

const List:React.FC = () =>{
    const { Search } = Input;
    const [searchValue, setSearchValue] = useState('');
    const [searchResults,setSearchResult] = useState([])
    const [requestStatus, setRequestStatus] = useState(0)
    const handleSearch = (value: string) => {
      search(value);
    };
    const search = async(v:string)=>{
      await axiosInstance.get('preference/?search='+v)
      .then((res)=>{
        setSearchResult(res.data)
      }).catch((error)=>{
        if(error.request.status===404)
          message.error(JSON.stringify("No results found"))
      })
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
                  axiosInstance.delete(`/course/${id}/`)
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
    const displayObjectConytaint = async(obj:any, editId:number,target:string) =>{
        console.info('need to log something');
        switch (target){
            case "general":
                break
            case 'building':
                break
            case 'floor':
                break
            case 'room':
                break
            case 'faculty':
                break
            case 'department':
                break
            case 'program':
                break
            case 'coursesemester':
                break
            case 'semester':
                break
            case 'coursegroup': 
                break
            case 'title':
                break
            case 'course':
                break
            case 'preference':
                break
            case 'position':
                break
            default:
                return
        }
        const textContaint = JSON.stringify(
            obj.map((o:any)=>{
                return <div></div>
            })
        )
        return Swal.fire({
            title: "Deleting",
            text: "Do you want to delete this item ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            // cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result:any) => {
            if (result.isConfirmed) {
                
            }
          });
    }
  const [edit, setEdit] = useState(0)
  
  const listItems = () => {
      return (
          searchResults.map((item:any) => (
              <tr key={item.id}>
                <td
                 onClick={()=>{displayObjectConytaint(item.general,item.id,'general')}}>[{item.general.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.building,item.id,'building')}}>[{item.building.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.floor,item.id,'floor')}}>[{item.floor.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.room,item.id,'room')}}>[{item.room.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.faculty,item.id,'faculty')}}>[{item.faculty.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.department,item.id,'department')}}>[{item.department.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.program,item.id,'program')}}>[{item.program.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.course_semester,item.id,'course_semester')}}>[{item.course_semester.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.semester,item.id,'semester')}}>[{item.semester.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.course,item.id,'course')}}>[{item.course.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.coursegroup,item.id,'coursegroup')}}>[{item.coursegroup.length} ] elements</td>
                <td>{item.type} </td>
                <td
                 onClick={()=>{displayObjectConytaint(item.event_time,item.id,'event_time')}}>[{item.event_time.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.title,item.id,'title')}}>[{item.title.length} ] elements</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.position,item.id,'position')}}>[{item.position.length} ] elements</td>
                <td>{item.description} </td>
                <td>{item.start} </td>
                <td>{item.end}  </td>
                <td>{item.date.length} </td>
                <td>{item.status?
                      <button type="button" className="btn btn-outline-primary m-2" >Enable</button>: 
                      <button type="button" className="btn btn-outline-danger m-1">Disable</button>}</td>
                <td
                 onClick={()=>{displayObjectConytaint(item.user,item.id,'user')}}>{item.user}</td>
                <td>{item.created_at}</td>
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
              <th scope="col">general</th>
              <th scope="col">building</th>
              <th scope="col">floor</th>
              <th scope="col">room</th>
              <th scope="col">faculty</th>
              <th scope="col">department</th>
              <th scope="col">program</th>
              <th scope="col">course_semester</th>
              <th scope="col">semester</th>
              <th scope="col">course</th>
              <th scope="col">coursegroup</th>
              <th scope="col">type</th>
              <th scope="col">event_time</th>
              <th scope="col">title</th>
              <th scope="col">position</th>
              <th scope="col">description</th>
              <th scope="col">start</th>
              <th scope="col">end</th>
              <th scope="col">date</th>
              <th scope="col">status</th>
              <th scope="col">user</th>
              <th scope="col">created_at</th>
              <th scope="col">Actions</th>
          </tr>
      </thead>
      <tbody>
          {listItems()}
      </tbody>
  </table>
  {<RequestHandler status={requestStatus}/>}
  
  {/* {edit !==0? (<Edit id={edit}/>):''} */}
  </>
  
    );
  }



const Lecturer = (props:any) => {
    if(props?.type==='create')
    return <Create/>
    if(props?.type==='list')
    return <List/>
    return <div>{props?.type}</div>
    
}

export default Lecturer
                                                                                                                                                                                                                                                                                                     