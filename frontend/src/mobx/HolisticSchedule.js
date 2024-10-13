import { computed, makeAutoObservable } from "mobx";
import { PrivateDefaultApi } from "../utils/AxiosInstance";
import rootStore from ".";
class HolisticScheduleStore {
    allowedDisplay = [
        {name:'course',status:true},
        {name:'room',status:true},
        {name:'lecturer',status:true},
        {name:'assistant',status:false},
        {name:'student',status:true},
        {name:'semester',status:true},
        {name:'program',status:true},
        {name:'department',status:true},
        {name:'faculty',status:true},
        {name:'floor',status:true},
        {name:'building',status:true},
        {name:'complete',status:false},
        {name:'create_schedule',status:true},
    ]
    credentDisplay = [
        {
            name:'OT',
            status:true,
            content:[
                'course',
                'semester',
                'program',
                'department',
                'faculty',
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
                'department',
                'faculty',
                'floor',
                'building',
                'complete',
                'create_schedule'
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
                'department',
                'faculty',
                'floor',
                'building',
                'complete',
                'create_schedule'
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
                'department',
                'faculty',
                'floor',
                'building',
                'complete',
            ]
        },{
            name:'HOD',
            status:true,
            content:[
                'course',
                'room',
                'lecturer', 
                'assistant',
                'student',
                'semester',
                'program',
                'department',
                'faculty',
                'floor',
                'building',
                'complete',
            ]
        }
        ,{
            name:'AD',
            status:true,
            content:[
                'course',
                'lecturer', 
                'assistant',
                'student',
                'semester',
                'program',
                'department',
                'faculty',
                'complete',
            ]
        },
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
    getRandomColor() {
        // List of selected colors
        const colors = ['#B2B000', '#01F500', '#235FFF', '#D912FF', '#1AFFE7', '#F90028'];
        // Get a random index from 0 to colors.length - 1
        const randomIndex = Math.floor(Math.random() * colors.length);
        // Return the color at the random index
        return colors[randomIndex];
    }
}

export default HolisticScheduleStore;
