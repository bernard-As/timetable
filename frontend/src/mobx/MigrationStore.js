import { makeAutoObservable } from "mobx";
import { PrivateApi, PrivateDefaultApi } from "../utils/AxiosInstance";

class MigrationStore {

    messages = [];
    selectedTerms = {
        target:null,
        source:null
    }
    availableTerms = []
    transferObjects:any = [
        {
            label:'Semester',
            value:'coursesemester',
            columns: [
                {
                  dataIndex: 'program',
                  title: 'Program',
                },
                {
                    dataIndex: 'semester_num',
                    title: 'Semester No',
                  },
                {
                    dataIndex: 'course_num',
                    title: 'Courses Count',
                }
              ]
        },
        {
            label:'Course-group',
            value:'coursegroup',
            columns: [
                {
                  dataIndex: 'name',
                  title: 'Name',
                },
                {
                    dataIndex: 'group',
                    title: 'Group',
                  },
                {
                    dataIndex: 'lecturer',
                    title: 'Lecturer',
                }
              ]
        }
    ]
    selectedTransferObject = null;
    transferWIthCourseGroup = false;

    dataSource = []
    selectedTargetkeys = []

    courseSemesters = []
    selectedCourseSemester =  null
    constructor(){
        makeAutoObservable(this)
    }

    handleAddMessage(message){
        this.messages.push(message)
        const timeout = setTimeout(() => {
            this.messages = this.messages.filter(m=>m.id!==message.id);
            clearTimeout(timeout);
        }, 3500);
    }

    handleTermSelection(data,type){
        if(type==='target'&&data === this.selectedTerms.source)
        {
            this.handleAddMessage({
                id:Date.now(),
                message: 'Source and Target should be different',
                type:'error'
            })
            return
        }
        this.selectedTerms[type] = data;
    }

    async getAvailableTerms (){
        try {
            await PrivateDefaultApi.get('semester/').then((res)=>{
                if (res.status===200){
                    this.availableTerms = res.data
                }else{
                    this.handleAddMessage({
                        id:Date.now(),
                        message: 'Failed to fetch term!',
                        type:'error'
                    })
                }
            }).catch((error)=>{
                this.handleAddMessage({
                    id:Date.now(),
                    message: 'Failed to fetch term!',
                    type:'error'
                })
            })
        } catch (error) {
            this.handleAddMessage({
                id:Date.now(),
                message: 'Failed to fetch term!',
                type:'error'
            })
        }
    }

    handleTransferObject(value){
        if(!this.selectedTerms.source||!this.selectedTerms.target){
            this.handleAddMessage({
                id:Date.now(),
                message: ' Please select Source and Target terms',
                type:'error'
            })
            return
        }
        this.selectedTransferObject = value;
        if (value==='coursesemester')
            this.handleGetObjectContent(value);
        else{
            this.handleGetObjectContent('coursesemester');
        }
    }

    toogletransferWIthCourseGroup(){
        this.transferWIthCourseGroup = !this.transferWIthCourseGroup;
    }

    async handleGetObjectContent(obj){
        await PrivateDefaultApi.post('migration_view/',{
            obj:obj,
            source:this.selectedTerms.source,
            target:this.selectedTerms.target,
            includecoursegroup:this.transferWIthCourseGroup
        }).then((res)=>{
            if(res.status===200){
                this.courseSemesters = res.data.source
                this.dataSource =res.data.source
                this.selectedTargetkeys = res.data.source.filter(s => s.exists_in_target === true).map(s => s.key)
            }
        }).catch((error)=>{
            this.handleAddMessage({
                id:Date.now(),
                message: ' could not fetch '+obj,
                type:'error'
            })
        })
    }
    getTermName(target){
        const t = this.availableTerms.find(t=>t.id===migrationStore.selectedTerms[target])
        if (t)
            return t.year + ' ' + t.season
        else
            return target.toUpperCase()
    }
    handleSelectedTarget(keys){
        this.selectedTargetkeys = keys
    }
    handleRefresh(){
        this.selectedTargetkeys = []
        if (this.selectedTransferObject==='coursesemester')
        this.handleGetObjectContent(this.selectedTransferObject)
        else
        this.handleselectedCourseSemester(this.selectedCourseSemester)
    }
    async handleSave(){
        await PrivateDefaultApi.post('migration_view/',{
            save:true,
            targetIds:this.selectedTargetkeys,
            includecoursegroup:this.transferWIthCourseGroup,
            obj:this.selectedTransferObject,
            source:this.selectedTerms.source,
            target:this.selectedTerms.target,
            courseSemester:this.selectedCourseSemester
        }).then((res)=>{
            if(res.status===200){
                this.handleAddMessage({
                    id:Date.now(),
                    message: 'Update saved',
                    type:'success'
                })
                this.handleRefresh()
                
            }
        }).catch((error)=>{
            this.handleAddMessage({
                id:Date.now(),
                message: 'Could not save! Please try later',
                type:'error'
            })
        })
    }
    async handleselectedCourseSemester(value){
        this.selectedCourseSemester = value;
        await PrivateDefaultApi.post('migration_view/',{
            obj:'coursegroup',
            source:this.selectedTerms.source,
            target:this.selectedTerms.target,
            includecoursegroup:this.transferWIthCourseGroup,
            courseSemester:this.selectedCourseSemester
        }).then((res)=>{
            if(res.status===200){
                // this.courseSemesters = res.data.source
                this.dataSource =res.data.source
                this.selectedTargetkeys = res.data.source.filter(s => s.exists_in_target === true).map(s => s.key)
            }
        }).catch((error)=>{
            this.handleAddMessage({
                id:Date.now(),
                message: ' could not fetch '+'coursegroup',
                type:'error'
            })
        })
    }
}
const migrationStore = new MigrationStore()
export default migrationStore;