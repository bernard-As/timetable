import { Card } from "antd"
import { observer } from "mobx-react"
import rootStore from "../../../../mobx"
import { useEffect, useState } from "react"
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance"

const Details = observer(()=>{
    const model = rootStore.holosticScheduleContentStore.currentModel;
    const id = rootStore.holosticScheduleContentStore.viewDetail.recordToView;
    const [data,setData] = useState({})
    useEffect(()=>{
        PrivateDefaultApi.get(`${model.apiUrl}/${id}/`).then((res)=>{
            setData(res.data)
        }).catch((error)=>{
            console.error(error)
        })
    },[id])
    return(
        <Card
            title={`${(model.name.toUpperCase())}`}
            style={{
                maxWidth:'500px'
            }}
        >
            {model.detail.map((d,i)=>{
                return(
                    <div key={i}>
                        {d.toUpperCase()} : {data[d]}
                        {d==='status'&&(data['status']===true?'Active':'Inactive')}
                    
                    </div>
                )
            })

            }
        </Card>
    )
})
export default Details