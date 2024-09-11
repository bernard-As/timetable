import { computed, makeAutoObservable } from "mobx";
class HolisticScheduleStore {
    allowedDisplay = [
        {name:'course',status:false},
        {name:'room',status:true},
        {name:'lecturer',status:true},
        {name:'assistant',status:true},
        {name:'semester',status:true},
        {name:'program',status:true},
        {name:'faculty',status:true},
        {name:'building',status:true},
    ]
    constructor() {
        makeAutoObservable(this);
    }
   checkDisplayAvailability(location){
    const locationArr = location.pathname.split('/');
    console.info(locationArr)
    let targetId = 3
    if(locationArr.length===3) targetId = 2
    const isAllowed = this.allowedDisplay.filter(d=>d.name===(locationArr[targetId])&&d.status).length>0
    console.log(isAllowed)
    return isAllowed
   }

}

export default HolisticScheduleStore;
