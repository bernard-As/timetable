import { Avatar, List, Table, Tooltip } from "antd";
import rootStore from "../../../../mobx";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { PrivateDefaultApi } from "../../../../utils/AxiosInstance";
import { CgDetailsLess } from "react-icons/cg";
import { GrFormSchedule } from "react-icons/gr";
const SearchResult = observer(({results,model})=>{
    const [data,setData] = useState([]);
    useEffect(()=>{console.log(results);setData(results)},[results])
    useEffect(()=>{
        const singleDelete = async(id)=>{
            let apiUrl = model.apiUrl
            if(apiUrl==='course')apiUrl='coursegroup'
            await PrivateDefaultApi.delete(`${apiUrl}/${id}/`).then((res)=>{
                rootStore.notification.notify({
                    type:'success',
                    text: `${model.name} deleted `,
                    timeout:1000,
                    title:`${model.name} deleted `
                })
            }).catch((error)=>{ 
                console.log(error)
            })
        }
        const handleDelete = ()=>{
            if(model.name===rootStore.holosticScheduleContentStore.delete.targetModel ){
                const idsTodel = rootStore.holosticScheduleContentStore.delete.recordToDelete;
                rootStore.holosticScheduleContentStore.delete.recordToDelete.forEach((id)=>{
                    singleDelete(id)
                    rootStore.holosticScheduleContentStore.delete.recordToDelete = rootStore.holosticScheduleContentStore.delete.recordToDelete.filter(r=>r!==id);
                    // setData(data.filter(d=>d.id!== id))
                })
                rootStore.holosticScheduleContentStore.delete.targetModel = null
                setData(data.filter(d=>!idsTodel.includes(d.id)))
            }
        }
        rootStore.enableManagement&&rootStore.isManager()&&handleDelete()
    },[rootStore.holosticScheduleContentStore.delete.targetModel])
    useEffect(()=>{
        if(data.length>0&&data[0].key===undefined){
            const newData = data.map(({ id, ...rest }) => ({ key: id,id:id, ...rest }));
            setData(newData);
        }
    },[data])
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
        //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          rootStore.holosticScheduleContentStore.selectedRows.selectedRows = selectedRowKeys
          rootStore.holosticScheduleContentStore.selectedRows.targetModel = model.name
        },
        
      };
    return (<>
        {data.length===0&&
            <div>Nothing to display yet</div>
        }
        {(data.length!==0&&((rootStore.enableManagement&&rootStore.isManager())||(model.name==='student'&&rootStore.isAdvisor())))?
            <Table 
                dataSource={data} 
                columns={model.columns}
                rowSelection={rowSelection}
            />
            :
            <List
            style={{maxWidth:'600px',backgroundColor:'#C9D6DF'}}
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[<Tooltip title={'details'}><CgDetailsLess size={32}
                        onClick={()=>rootStore.holosticScheduleContentStore.prepareToViewDetail(item.id)}
                    /></Tooltip>,
                    <Tooltip title={'Schedule'}>
                    <GrFormSchedule size={32}
                        onClick={()=>{
                            rootStore.holosticScheduleContentStore.prepareToSchedule(item.id)
                        }}
                    />
                </Tooltip>
                ]}
                  >
                    <List.Item.Meta
                    //   avatar={ <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                      title={item[rootStore.holosticScheduleContentStore.getListDetail(model.name).title]}
                      description={item[rootStore.holosticScheduleContentStore.getListDetail(model.name).description]}
                    />
                  </List.Item>
                )}
            />
            
        }
    </>)
})
export default SearchResult;