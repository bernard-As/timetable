import { computed, makeAutoObservable } from "mobx";
import { PrivateDefaultApi } from "../utils/AxiosInstance";
import rootStore from ".";
class HolisticScheduleStore {
    allowedDisplay = [
        {name:'course',status:true},
        {name:'room',status:true},
        {name:'lecturer',status:true},
        {name:'assistant',status:true},
        {name:'student',status:true},
        {name:'semester',status:true},
        {name:'program',status:true},
        {name:'faculty',status:true},
        {name:'building',status:true},
        {name:'complete',status:true},
    ]
    credentDisplay = [
        {
            name:'OT',
            status:true,
            content:[
                'course',
                'room',
                'lecturer',
                'student',
                'assistant',
                'semester',
                'program',
                'faculty',
                'building',
                'complete'
            ],

        },
        {
            name:'SYSADM',
            status:true,
            content:[
                'course',
                'room',
                'lecturer', 
                'assistant',
                'student',
                'semester',
                'program',
                'faculty',
                'building',
                'complete',
            ]
        },
        {
            name:'PADM',
            status:true,
            content:[
                'course',
                'room',
                'lecturer', 
                'assistant',
                'student',
                'semester',
                'program',
                'faculty',
                'building',
                'complete',
            ]
        },{
            name:'VR',
            status:true,
            content:[
                'course',
                'room',
                'lecturer', 
                'assistant',
                'student',
                'semester',
                'program',
                'faculty',
                'building',
                'complete'
            ]
        }
    ]
    constructor() {
        makeAutoObservable(this);
    }
    checkDisplayAvailability(location){
        const locationArr = location.pathname.split('/');
        let targetId = 3
        if(locationArr.length===3) targetId = 2;
        const isAllowed = Boolean(this.checkAllowDisplay(locationArr[targetId])&&this.checkCredentialAllowence(locationArr[targetId]))
        return isAllowed;
    }
    checkCredentialAllowence(name){
        if(!name) return false;
        const credArr = this.credentDisplay.find(c=>c.name===rootStore.credential);
        if(credArr) return credArr.content.includes(name);
    }
    checkAllowDisplay(name){
        if(!name) return false;
        return this.allowedDisplay.filter(a=>a.name===name.toString()&&a.status).length>0
    }
}

export default HolisticScheduleStore;
