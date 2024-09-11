import Cookies from "js-cookie";
import { computed, makeAutoObservable } from "mobx";
class MainStore {
    StartedNavigation = true;
    sideMenuCollapse = false;
    constructor() {
        makeAutoObservable(this,
            {
                darkMode:computed
            }
        );
    }
    get darkMode(){
        if(localStorage.getItem('dark-mode')||Cookies.get('dark-mode'))
            return true
        else return false
    }


}

export default MainStore;
