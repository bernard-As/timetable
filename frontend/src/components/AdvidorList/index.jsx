import { Card, Table } from "antd";
import { useEffect, useState } from "react"
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
import rootStore from "../../mobx";

const AdvisorList = ()=>{
    const [additionalData,setadditionalData] = useState([])
    const [data, setData] = useState([])
    const [loaded,setLoaded] = useState(false)
    const freefetchAdditional = (targetModel,id=null) =>{
        let url = targetModel+'/';
        if(id)
          url = url+id+'/'
        PrivateDefaultApi.post('free_model/',{
            model:targetModel,
            id:id
        }).then((res)=>{
          rootStore.holosticScheduleContentStore.addadditionallyFetchedData({
            target:targetModel,
            data:res.data
  
          })
          return 
        }).catch((error)=>{
          console.log(error);
        })
      }
    useEffect(()=>{
        rootStore.holosticScheduleContentStore.additionallyFetchedData = []
        freefetchAdditional('faculty')
        freefetchAdditional('department')
        freefetchAdditional('program')
        freefetchAdditional('lecturer')
        freefetchAdditional('title')
        freefetchAdditional('advisor')
    },[])
    useEffect(()=>{
        setadditionalData(rootStore.holosticScheduleContentStore.additionallyFetchedData)
        setLoaded(true)
    },[rootStore.holosticScheduleContentStore.additionallyFetchedData])
    
    useEffect(()=>{
        const getAddD = async({id})=>{
            const response = await freefetchAdditional('users',id)
            return additionalData.find(ad=>ad.target==='users')?.data.find(d=>d.id===id)
        }
        if(loaded&&additionalData.find(ad=>ad.target==='advisor')!==undefined){
            console.log(additionalData.find(ad=>ad.target==='advisor'),'lolooloo')
            const advisorList = additionalData.find(ad=>ad.target==='advisor')?.data
            let tore = []
            advisorList?.forEach((ad)=>{
                let y = getAddD({id:ad.user})
                // const lecturer = getAddD({id:ad.user})
                const title = additionalData.find(a=>a.target==='title')?.data.find(d=>d.id===y.title)
                const program = additionalData.find(a=>a.target==='title')?.data.filter(d=>d.id in y.program)
                // const department = getAddD({id:ad.department_id})
                // const faculty = additionalData.find(a=>a.target==='title')?.data.find(d=>d.id===y.title)
                tore.push({
                    id:ad.id,
                    title:title,
                    // faculty:faculty,
                    // department:department,
                    program:program
                })
                })
                setData(tore)
        }
    } ,[loaded, additionalData])

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render:(_,record)=>{
                return(
                    <span>
                        {record.shortname}
                    </span>
                )
            }
          },
        {
          title: 'First Name',
          dataIndex: 'first_name',
          key: 'first_name',
        },
        {
          title: 'Last Name',
          dataIndex: 'last_name',
          key: 'last_name',
        },
        {
          title: 'Program (s)',
          dataIndex: 'program',
          key: 'program',
        },
      ];
    return(
        <>
            <Card
                title={<span>Advisors</span>}
                 // extra={<div><MdOpenInNew size={25}/></div>}
                className="new-preview"
            >
                <Table columns={columns} dataSource={data} />
            </Card>
        </>

    )
}

export default AdvisorList