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
        {name:'floor',status:true},
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
                'floor',
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
                'floor',
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
                'floor',
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
                'floor',
                'building',
                'complete'
            ]
        }
    ]
    constructor() {
        makeAutoObservable(this);
    }
    getModelUrlId(locationArr){
        if(locationArr.includes('home'))
            return 3
        else
            return 2

    }
    getModelName(location){
        const locArr = location.pathname.split('/')
        return locArr[this.getModelUrlId(locArr)]
    }
    checkDisplayAvailability(location){
        const locationArr = location.pathname.split('/');
        let targetId = this.getModelUrlId(locationArr)
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
    deleteLocalStorageItemWith(text){
        for (let key in localStorage) {

            if (key.startsWith(text)) {
        
                localStorage.removeItem(key);
        
            }
        
        }
    }
}

export default HolisticScheduleStore;
