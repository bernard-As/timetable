import { computed, makeAutoObservable } from "mobx";
import { PrivateDefaultApi } from "../utils/AxiosInstance";
import rootStore from ".";
import dayjs from "dayjs";
class HolisticScheduleStore {
    allowedDisplay = [
        {name:'course',status:true},
        {name:'room',status:true},
        {name:'lecturer',status:true},
        {name:'assistant',status:true},
        {name:'student',status:true},
        {name:'semester',status:true},
        {name:'program',status:true},
        {name:'department',status:true},
        {name:'faculty',status:true},
        {name:'floor',status:true},
        {name:'building',status:true},
        {name:'complete',status:true},
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
    add_schedule_holder = {
        status:false,
        type:'Daily',
        assignmentType:'Final',
        date:dayjs(Date.now()).format('YYYY-MM-DD'),
        start: [
            dayjs('09:00:00', 'HH:mm:ss'), // Start time
            dayjs('17:00:00', 'HH:mm:ss')  // End time
        ]
    }
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
        const colors = ['#b8b65ad5', '#7eec7ec9', '#235effa9', '#d812ff77', '#d812ff77', '#f9002985'];
        // Get a random index from 0 to colors.length - 1
        const randomIndex = Math.floor(Math.random() * colors.length);
        // Return the color at the random index
        return colors[randomIndex];
    }
    isPhone(){
        const isPhone = window.innerWidth < 768
        return isPhone
    }
    getDesignedColor(type){
        if(type === 1){
            return ''
        }else if(type===2){
            return 'rgba(139, 66, 139, 0.705)'
        }else if (type===3){
            return 'rgba(247, 168, 22, 0.637)'
        }else if(type===4){
            return 'rgba(139, 69, 19, 0.4)'
        }else if(type===5){
            return 'rgba(139, 69, 19, 0.4)'
        }else if(type===6){
            return '#03A9F4'
        }else if(type===7){
            return '#FF9800'
        }else if(type===8){
            return '#03A9F4'
        }
    }
}

export default HolisticScheduleStore;
