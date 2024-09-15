import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import { makeAutoObservable } from "mobx";
import { FaDotCircle   } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { GrFormSchedule,GrView } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoStar,IoStarOutline } from "react-icons/io5";

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

    header = [
        {
            name:'course',
            search:true,
            list:true,
            add:true,
            delete:false,
            prefered:true,
        },
        {
            name:'room',
            search:true,
            list:true,
            add:true,
            delete:false,
            prefered:true,
        },
        {
            name:'lecturer',
            search:true,
            list:true,
            add:true,
            delete:false,
            prefered:true,
        },
        {
            name:'assistant',
            search:true,
            list:true,
            add:true,
            delete:false,
            prefered:true,
        },
        {
            name:'semester',
            search:true,
            list:true,
            add:true,
            delete:false,
            prefered:true,
        },
        {
            name:'program',
            search:true,
            list:true,
            add:true,
            delete:false,
            prefered:true,
        },
        {
            name:'faculty',
            search:true,
            list:true,
            add:true,
            delete:false,
            prefered:true,
        },
        {
            name:'building',
            search:true,
            list:true,
            add:true,
            delete:false,
            prefered:true,
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
            listFields:[
                'name',
            ],
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
                            <GrFormSchedule size={27}/>
                        </Tooltip>
                        <Tooltip title={'Bookmark'}>
                            <IoStarOutline size={25}/>
                        </Tooltip>
                        <Tooltip title={'Edit'}>
                            <CiEdit size={25}/>
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
            ]
        },
        {
            name:"course",
            apiUrl:'course'
    
        }
    ]
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
}



export default HolosticScheduleContentStore;
