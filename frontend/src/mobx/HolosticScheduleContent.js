import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { makeAutoObservable } from "mobx";
import { FaDotCircle   } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { GrFormSchedule,GrView } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoStar,IoStarOutline } from "react-icons/io5";
import { FaGripLines } from "react-icons/fa6";
import { PrivateDefaultApi } from "../utils/AxiosInstance";
import rootStore from ".";
import { useEffect, useState } from "react";
import { CourseGroupDipslay, LecturerDisplay, RenderTableViewCourses, RenderTableViewDapartment, RenderTableViewFaculty, RenderTableViewProgram, RenderTableViewSemester, RoomCodeDipslay } from "../components/Content/HolisticSchedule/Content/AdditionalRendering";

class HolosticScheduleContentStore{
    delete = {
        targetModel: null,
        recordToDelete:[]
        
    }
    currentModel:any = null

    viewDetail = {
        targetModel: null,
        recordToView: null
    }
    edit = {
        targetModel: null,
        recordToEdit: null
    }
    schedule = {
        targetModel: null,
        recordToSchedule: null
    }
    selectedRows = {
        targetModel: null,
        selectedRows:[]
    }

    header = [
        {
            name:'course',
            search:true,
            list:true,
            add:true,
            delete:true,
            prefered:false,
        },
        {
            name:'room',
            search:true,
            list:true,
            add:true,
            delete:true,
            prefered:false,
        },
        {
            name:'lecturer',
            search:true,
            list:true,
            add:true,
            delete:true,
            prefered:false,
        },
        {
            name:'student',
            search:true,
            list:true,
            add:true,
            delete:true,
            prefered:false,
        },
        {
            name:'assistant',
            search:true,
            list:true,
            add:true,
            delete:true,
            prefered:false,
        },
        {
            name:'semester',
            search:true,
            list:true,
            add:true,
            delete:true,
            prefered:false,
        },
        {
            name:'program',
            search:true,
            list:true,
            add:true,
            delete:true,
            prefered:false,
        },
        {
            name:'department',
            search:true,
            list:true,
            add:true,
            delete:true,
            prefered:false,
        },
        {
            name:'faculty',
            search:true,
            list:true,
            add:true,
            delete:false,
            prefered:false,
        },
        {
            name:'floor',
            search:true,
            list:true,
            add:true,
            delete:true,
            prefered:false,
        },
        {
            name:'building',
            search:true,
            list:true,
            add:true,
            delete:true,
            prefered:false,
        },
        {
            name:'create_schedule',
            search:true,
            list:true,
            add:true,
            delete:true,
            prefered:false,
        }
    ]

    content = [
        {
            name:'building',
            apiUrl:'building',
            addFields:[
                'name',
                'code',
                'status',
                // 'longitude',
                // 'latitude',
            ],
            list:{
                title:'code',
                description:'name'
            },
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'name',
                    dataIndex:'name',
                    key:'name',
                    
                },
                {
                    title:'code',
                    dataIndex:'code',
                    key:'code',
                    render: (text)=><Tag color="blue">{text}</Tag>
 
                },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'name',
                'code',
                'status',
                // 'created_at',
                // 'updated_at',
            ],
            edit:[
                'name',
                'code',
                'status',
            ]
        },
        {
            name:'floor',
            apiUrl:'floor',
            addFields:[
                'floor_number',
                'building',
                'status',
                // 'longitude',
                // 'latitude',
            ],
            list:{
                title:'floor_number',
                description:'floor_number'
            },
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'floor_number',
                    dataIndex:'floor_number',
                    key:'floor_number',
                    
                },
                {
                    title:'building',
                    dataIndex:'building',
                    key:'building',
                    render: (text)=><Tag color="blue">{text}</Tag>
 
                },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'floor_number',
                'building',
                'status',
                // 'created_at',
                // 'updated_at',
            ],
            edit:[
                'floor_number',
                'building',
                'status',
            ]
        },
        {
            name:'room',
            apiUrl:'room',
            addFields:[
                'code',
                'floor',
                'capacity',
                'exm_capacity',
                'usable_for_exm',
                'room_type',
                'status',
                // 'longitude',
                // 'latitude',
            ],
            list:{
                title:'code',
                description:'code'
            },
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'Code',
                    dataIndex:'code',
                    key:'code',
                    
                },
                {
                    title:'Floor',
                    dataIndex:'floor',
                    key:'floor',
 
                },
                {
                    title:'Capacity',
                    dataIndex:'capacity',
                    key:'capacity',
                    render: (text)=><Tag color="blue">{text}</Tag>

                },
                {
                    title:'Room Type',
                    dataIndex:'room_type',
                    key:'room_type',
                    render: (text)=><Tag color="blue">{text}</Tag>
                },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'code',
                'floor',
                'capacity',
                'exm_capacity',
                'usable_for_exm',
                'room_type',
                'status',
                // 'created_at',
                // 'updated_at',
            ],
            edit:[
                'code',
                'floor',
                'capacity',
                'exm_capacity',
                'usable_for_exm',
                'room_type',
                'status',
            ]
        },
        {
            name:'faculty',
            apiUrl:'faculty',
            addFields:[
                'name',
                'shortname',
                'status',
                // 'longitude',
                // 'latitude',
            ],
            list:{
                title:'shortname',
                description:'name'
            },
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'Name',
                    dataIndex:'name',
                    key:'name',
                    
                },
                {
                    title:'Shortname',
                    dataIndex:'shortname',
                    key:'shortname',
                    render: (text)=><Tag color="blue">{text}</Tag>
 
                },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'name',
                'shortname',
                'status',
                // 'created_at',
                // 'updated_at',
            ],
            edit:[
                'name',
                'shortname',
                'status',
            ]
        },
        {
            name:'department',
            apiUrl:'department',
            addFields:[
                'name',
                'shortname',
                'faculty',
                'status',
                // 'longitude',
                // 'latitude',
            ],
            list:{
                title:'shortname',
                description:'name'
            },
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'Name',
                    dataIndex:'name',
                    key:'name',
                    
                },
                {
                    title:'Shortname',
                    dataIndex:'shortname',
                    key:'shortname',
                    render: (text)=><Tag color="blue">{text}</Tag>
 
                },
                {
                    title:'Faculty',
                    dataIndex:'faculty',
                    key:'faculty',
                    render: (_,record)=><RenderTableViewFaculty id={record.faculty} />
                    
                },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'name',
                'shortname',
                'faculty',
                'status',
                // 'created_at',
                // 'updated_at',
            ],
            edit:[
                'name',
                'shortname',
                'faculty',
                'status',
            ]
        },
        {
            name:'program',
            apiUrl:'program',
            addFields:[
                'name',
                'shortname',
                'department',
                'status',
                // 'longitude',
                // 'latitude',
            ],
            list:{
                title:'shortname',
                description:'name'
            },
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'Name',
                    dataIndex:'name',
                    key:'name',
                    
                },
                {
                    title:'Shortname',
                    dataIndex:'shortname',
                    key:'shortname',
                    render: (text)=><Tag color="blue">{text}</Tag>
 
                },
                {
                    title:'Department',
                    dataIndex:'department',
                    key:'department',
                    render: (_,record)=><RenderTableViewDapartment id={record.department} />
                },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'name',
                'shortname',
                'department',
                'status',
                // 'created_at',
                // 'updated_at',
            ],
            edit:[
                'name',
                'shortname',
                'department',
                'status',
            ]
        },
        {
            name:'semester',
            apiUrl:'coursesemester',
            addFields:[
                'program',
                'semester',
                'semester_num',
                'status',
                // 'longitude',
                // 'latitude',
            ],
            list:{
                title:'semester_num',
                description:'semester_num'
            },
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'Program',
                    dataIndex:'program',
                    key:'program',
                    render: (_,record)=><RenderTableViewProgram id={record.program} />

                },
                {
                    title:'Semester',
                    dataIndex:'semester',
                    key:'semester',
                    render: (_,record)=><RenderTableViewSemester id={record.semester} />
 
                },
                {
                    title:'Semester Number',
                    dataIndex:'semester_num',
                    key:'semester_num',
                    render: (text)=><Tag color="blue">{text}</Tag>
                    
                },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'program',
                'semester',
                'semester_num',
                'status',
                // 'created_at',
                // 'updated_at',
            ],
            edit:[
                'program',
                'semester',
                'semester_num',
                'status',
            ]
        },
        {
            name:'lecturer',
            apiUrl:'lecturer',
            addFields:[
                'username',
                'password',
                'first_name',
                'last_name',
                'email',
                'title',
                'faculty_m',
                'department_m',
                'program_m',
                'credential',
                'status',
                // 'longitude',
                // 'latitude',
            ],
            list:{
                title:'first_name',
                description:'last_name'
            },
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'First Name',
                    dataIndex:'first_name',
                    key:'first_name',
                    
                },
                {
                    title:'Last Name',
                    dataIndex:'last_name',
                    key:'last_name',
                    
                },
                {
                    title:'Title',
                    dataIndex:'title',
                    key:'title',
                    
                },
                {
                    title:'Program',
                    dataIndex:'program',
                    key:'program',
 
                },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'username',
                'password',
                'first_name',
                'last_name',
                'email',
                'title',
                'faculty',
                'department',
                'program',
                'credential',
                'status',
                // 'created_at',
                // 'updated_at',
            ],
            edit:[
                'username',
                'password',
                'first_name',
                'last_name',
                'email',
                'title',
                'faculty_m',
                'department_m',
                'program_m',
                'credential',
                'status',
            ]
        },
        {
            name:'course',
            apiUrl:'course',
            addFields:[
                'code',
                'name',
                'status',
                // 'longitude',
                // 'latitude',
            ],
            extraField:[
                'group_number',
                'duration',
                'max_capacity',
                'lecturer',
                'assistant',
                // 'lecturer_assistant',
                'activitytype',
                'merged_with',
                'extra_session_of',
                // 'current_capacity',
                'prerequisites',
                'course_semester',
                'status',
                'is_elective',
            ],
            list:{
                title:'code',
                description:'name',

            },
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'Code',
                    dataIndex:'code',
                    key:'code',
                    
                },
                {
                    title:'Name',
                    dataIndex:'name',
                    key:'name',
                    
                },
                {
                    title:'Group Number',
                    dataIndex:'group_number',
                    key:'group_number',
                    
                },
                {
                    title: 'Lecturer',
                    dataIndex: 'lecturer',
                    key: 'lecturer',
                    render: (id) => {
                      return <LecturerDisplay id={id} getAdditional={this.getAdditional} />;
                    }
                  },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'code',
                'name',
                'status',
            ],
            edit:[
                'code',
                'name',
                'status',
            ]
        },
        {
            name:'create_schedule',
            apiUrl:'schedule',
            addFields:[
                'type',
                'assignmentType',
                'day',
                'date',
                'start',
                'coursegroup_s',
                'room_s'
            ],
            listFields:[
                'name',
            ],
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'Course',
                    dataIndex:'coursegroup',
                    key:'coursegroup',
                    render:(_,record)=><CourseGroupDipslay id={record.coursegroup}/>
                },
                {
                    title:'Room',
                    dataIndex:'room',
                    key:'room',
                    render: (_,record)=><RoomCodeDipslay id={record.room}/>
                },
                {
                    title:'Date',
                    dataIndex:'date',
                    key:'date',
                    
                },
                {
                    title:'Day',
                    dataIndex:'day',
                    key:'day',
                    render:(_,record)=>(<span>
                        {rootStore.holosticScheduleContentStore.daysIndex.find(d=>d.id===record.day)?.name}
                    </span>)
                    
                },
                {
                    title:'Start',
                    dataIndex:'start',
                    key:'start',
                    
                },
                {
                    title:'End',
                    dataIndex:'end',
                    key:'end',
                    
                },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'type',
                'day',
                'date',
                'start',
                'coursegroup_s',
                'room_s'
                // 'created_at',
                // 'updated_at',
            ],
            edit:[
                'type',
                'day',
                'date',
                'start',
                'coursegroup_s',
                'room_s'
            ]
        },
        {
            name:'student',
            apiUrl:'student',
            addFields:[
                // 'username',
                // 'password',
                'first_name',
                'last_name',
                'studentId',
                'email',
                'faculty',
                'department',
                'program',
                'coursegroup_m',
                'status',
                'coursesPreview'
                // 'longitude',
                // 'latitude',
            ],
            list:{
                title:'studentId',
                description:'first_name'
            },
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'First Name',
                    dataIndex:'first_name',
                    key:'first_name',
                    
                },
                {
                    title:'Last Name',
                    dataIndex:'last_name',
                    key:'last_name',
                    
                },
                {
                    title:'Student Id',
                    dataIndex:'studentId',
                    key:'studentId',
                    
                },
                {
                    title:'Courses',
                    dataIndex:'coursegroup',
                    key:'coursegroup',
                    render: (_,render)=><RenderTableViewCourses id={render.coursegroup}/>                    
                },
                {
                    title:'Program',
                    dataIndex:'program',
                    key:'program',
                    render: (_,render)=><RenderTableViewProgram id={render.program}/>
                },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'username',
                'password',
                'first_name',
                'last_name',
                'email',
                'title',
                'faculty',
                'department',
                'program',
                'credential',
                'status',
                // 'created_at',
                // 'updated_at',
            ],
            edit:[
                'username',
                'password',
                'first_name',
                'last_name',
                'email',
                'title',
                'faculty_m',
                'department_m',
                'program_m',
                'credential',
                'status',
            ]
        },
        {
            name:'assistant',
            apiUrl:'assistant',
            addFields:[
                'student',
                'coursegroup_m',
                'status',
                'coursesPreview_m'
                // 'longitude',
                // 'latitude',
            ],
            list:{
                title:'studentId',
                description:'first_name'
            },
            listExtraButtons:{
                prefered:true,
                viewSchedule:true
            },
            columns:[
                {
                    title:'Title',
                    dataIndex:'title',
                    key:'title',
                    
                },
                {
                    title:'First Name',
                    dataIndex:'first_name',
                    key:'first_name',
                    
                },
                {
                    title:'Last Name',
                    dataIndex:'last_name',
                    key:'last_name',
                    
                },
                {
                    title:'Student Id',
                    dataIndex:'studentId',
                    key:'studentId',
                    
                },
                {
                    title:'Courses',
                    dataIndex:'coursegroup',
                    key:'coursegroup',
                    render: (_,render)=><RenderTableViewCourses id={render.coursegroup}/>
                    
                },
                {
                    title:'Program',
                    dataIndex:'program',
                    key:'program',
                    render: (_,render)=><RenderTableViewProgram id={render.program}/>
                },
                {
                    title:'status',
                    dataIndex:'status',
                    key:'status',
                    render: (b) => 
                        <Tooltip title={b ?'Active':'Inactive'}>
                        <FaDotCircle  
                            style={{
                                color: b ? 'green' : 'red',
                            }}
                        />
                        </Tooltip>
                    ,
                    style:{width:2}
                },
                {
                    title: 'Action',
                    key: 'operation',
                    fixed: 'right',
                    // width: 100,
                    render: (_,record) => <Space>
                         <Tooltip title={'View full details'}>
                            <GrView size={21} 
                                onClick={()=>{
                                    this.prepareToViewDetail(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Schedule'}>
                            <GrFormSchedule size={27}
                                onClick={()=>{
                                    this.prepareToSchedule(record.id)
                                }}
                            />
                        </Tooltip>
                        {/* <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip> */}
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}
                                onClick={()=>{
                                    this.prepareToEdit(record.id)
                                }}
                            />
                        </Tooltip>
                        <Tooltip title={'Delete'}>
                            <Popconfirm 
                                title="Sure to delete?"  
                                onConfirm={() => {
                                    this.prepareToDelete(record.id)
                                }}>
                                <MdDeleteForever color="red" size={25}/>
                            </Popconfirm>
                        </Tooltip>

                    </Space>,
                  },
            ],
            detail:[
                'student',
                'coursegroup_m',
                'status',
                'coursesPreview_m'
                // 'created_at',
                // 'updated_at',
            ],
            edit:[
               'student',
                'coursegroup_m',
                'status',
                'coursesPreview_m'
            ]
        }, 
        
    ]
    additionallyFetchedData = []

    daysIndex = [
        { id: 1, name: 'Monday' },
        { id: 2, name: 'Tuesday' },
        { id: 3, name: 'Wednesday' },
        { id: 4, name: 'Thursday' },
        { id: 5, name: 'Friday' },
        { id: 6, name: 'Saturday' },
        // { id: 7, name: 'Sunday' },
    ]

    refreshSchedule = true
    focusSearch = false
    constructor() {
        makeAutoObservable(this);
    }
    prepareToDelete(id){
        this.delete.targetModel = this.currentModel.name;
        this.delete.recordToDelete = [id];
    }
    prepareToViewDetail(id){
        this.viewDetail.targetModel = this.currentModel.name;
        this.viewDetail.recordToView = id;
    }
    prepareToEdit(id){
        this.edit.targetModel = this.currentModel.name;
        this.edit.recordToEdit = id
    }
    addadditionallyFetchedData(data){
        this.additionallyFetchedData.push(data);
    }
    async getAdditional(targetModel, id) {
        let url = `${targetModel}/`;
        if (id) {
            url = `${url}${id}/`;
        }
    
        return PrivateDefaultApi.get(url)  // Return the promise
            .then((res) => {
                return res.data;  // Return the data from the response
            })
            .catch((error) => {
                console.error(error);
                return null;  // Return null or handle the error appropriately
            });
    }
    prepareToSchedule(id){
        this.schedule.targetModel = this.currentModel.name !== 'course'?this.currentModel.name :'coursegroup'
        this.schedule.recordToSchedule = id
    }
    getListDetail(model){
        let title = this.content.find(c=>c.name===model)?.list.title
        let description = this.content.find(c=>c.name===model)?.list.description
        return {
            title:title,
            description:description
        }
    }
    
}



export default HolosticScheduleContentStore;
