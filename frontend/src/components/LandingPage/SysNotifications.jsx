import { Card } from "antd"
import { useEffect } from "react";
import { PublicDefaultApi, PublicMainApi } from "../../utils/AxiosInstance";

const SystNewsNotification =  ()=>{
    const getNews = ()=>{
        PublicDefaultApi.get('latest/').then((res)=>{
            console.log(res.data)
        }).catch((error)=>{
            console.log(error)
        })
    }
    useEffect(()=>{
        setTimeout(() => {
            getNews()
        }, 120000);
    },[])
    return(
        <Card
            className="sys-news"
        >
            News Here
        </Card>
    )
}
export default SystNewsNotification;