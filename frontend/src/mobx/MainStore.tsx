import { makeAutoObservable } from "mobx";
class MainStore {
    StartedNavigation = true;
    constructor() {
        makeAutoObservable(this);
    }


}

export default MainStore;
