import { Card, List, Tag } from "antd";
import { useEffect, useState } from "react";
import { MdOpenInNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { PrivateDefaultApi } from "../../utils/AxiosInstance";
import rootStore from "../../mobx";
import { observer } from "mobx-react";
const UpComingLecturesPreview = observer(()=>{
    const navigate = useNavigate()
    const [data,setData] = useState([])
    const [additionalData,setadditionalData] = useState([])
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
        freefetchAdditional('building')
        freefetchAdditional('floor')
        freefetchAdditional('faculty')
        freefetchAdditional('department')
        freefetchAdditional('program')
        freefetchAdditional('semester')
        freefetchAdditional('title')
        freefetchAdditional('lecturer')
        freefetchAdditional('course')
        // fetchAdditional('assistant')
        freefetchAdditional('activitytype')
        freefetchAdditional('coursegroup')
        freefetchAdditional('coursesemester')
      },[])
    useEffect(()=>{
        setadditionalData(rootStore.holosticScheduleContentStore.additionallyFetchedData)
      },[rootStore.holosticScheduleContentStore.additionallyFetchedData])
    useEffect(()=>{
        const getSystemNew = ()=>{
            PrivateDefaultApi.get('upcoming-schedule/').then((res)=>{
                setData(res.data);
            }).catch(error=>{
                console.log(error);
            })
        }
        getSystemNew()
    },[navigate])

    return (
        <Card
            title={<span>Upcoming Lectures</span>}
            // extra={<div><MdOpenInNew size={25}/></div>}
            className="new-preview"
        >
            <List
                itemLayout="horizontal"
                dataSource={data}
                style={{
                    overflowY:'scroll',
                    maxHeight: '320px',
                }}
                renderItem={(item, index) => (
                    <List.Item
                      style={{margin:'10px'}}
                    >
                      <List.Item.Meta
                        title={
                          <span>
                            {
                              additionalData.find(ad=>ad.target==='course')
                              ?.data.find(c=>c.id===additionalData
                                .find(ad=>ad.target==='coursegroup')
                                ?.data.find(d=>d.id===item.coursegroup)?.course)?.code
                            } {' '}

                            {
                              additionalData.find(ad=>ad.target==='course')
                              ?.data.find(c=>c.id===additionalData
                                .find(ad=>ad.target==='coursegroup')
                                ?.data.find(d=>d.id===item.coursegroup)?.course)?.name
                            }
                          </span>
                          
                        }
                        description={<span>Time Range: {item.start} ~ {item.end} 
                          {item.day!==null?
                            ` Day ${rootStore.holosticScheduleContentStore.daysIndex.find(d=>d.id===item.day)?.name}` :
                            ` Date ${item.date }`
                        }
                        </span>}
                        action={[<Tag color="grey">{item.created_at}</Tag>]}
                      />
                    </List.Item>
                  )}
            />
        </Card>
    )
})
export default UpComingLecturesPreview;