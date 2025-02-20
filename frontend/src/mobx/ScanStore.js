import { computed, makeAutoObservable } from "mobx";
import { PrivateApi, PrivateDefaultApi, PrivateDefaultApiM } from "../utils/AxiosInstance";
class ScanStore {
    lauched = false;
    showScanModal = false;
    errors = []
    constructor() {
        makeAutoObservable(this);
    }
    handleSetShowModaLScan(){
        this.showScanModal = !this.showScanModal;
    }
    
    async handleSubmitForScan(values){
        values['image'] = values['image'][0].originFileObj
        await PrivateDefaultApiM.post('/student-scan/',values).then((res)=>{
            console.log(res.data)
        }).catch((err)=>{
            this.handleErrors({
                title: 'Error',
                message: 'Failed to upload the image. Please try again.'
            })
        })
    }

    handleErrors(data){
        this.errors.push(data)
        const timeout = setTimeout(() => {
            this.errors= this.errors.filter((e)=>e!==data);
            clearTimeout(timeout)
        }, 3000);
    }


}

const scanStore = new ScanStore();
export default scanStore;
