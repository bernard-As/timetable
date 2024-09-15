import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import rootStore from "../../../mobx";
import { observer } from "mobx-react";
import { PrivateApi, PrivateDefaultApi } from "../../../utils/AxiosInstance";
import SearchResult from "./Content/SearchResult";
import Add from "./Content/Add";
import Details from "./Content/Details";
import Edit from "./Content/Edit";

 
const HContent:React.FC<{stopLoadingf:any,toDisplay:any,setToDisplay:any,searchData:any}> =observer(({stopLoadingf,toDisplay,setToDisplay,searchData})=>{
    const navigate = useNavigate()
    const location = useLocation();
    const model = rootStore.holisticScheduleStore.getModelName(location)
    const modelContent = rootStore.holosticScheduleContentStore.content.find(c=>c.name===model)
    rootStore.holosticScheduleContentStore.currentModel = modelContent
    const [results, setResults] = useState([])
    const [result, setResult]  = useState({})
    const [nothingToDisplay,setNothingToDisplay] = useState(true);

    useEffect(()=>{
        stopLoadingf(false);
    },[stopLoadingf])

    useEffect(()=>{
        if(toDisplay===null){
            setNothingToDisplay(true);
        }else
        setNothingToDisplay(false)
        if(toDisplay==='list'){
            PrivateDefaultApi.get(`${modelContent?.apiUrl}/`).then((res)=>{
                setResults(res.data);
            }).catch((error)=>{
                console.log(error);
            })
        }
    },[toDisplay])
    useEffect(()=>{

        const handleSearch = async()=>{
            if(searchData.length>0){
                const response = await PrivateApi.post(`${modelContent?.apiUrl}/search`,searchData);
                setResult(response.data);
            }
        }
    },[searchData])

    useEffect(()=>{
        if(rootStore.holosticScheduleContentStore.viewDetail.targetModel===modelContent?.name){
            setToDisplay('detail');
            rootStore.holosticScheduleContentStore.viewDetail.targetModel=null
        }

    },[rootStore.holosticScheduleContentStore.viewDetail.targetModel])

    useEffect(()=>{
        if(rootStore.holosticScheduleContentStore.edit.targetModel===modelContent?.name){
            setToDisplay('edit');
            rootStore.holosticScheduleContentStore.edit.targetModel=null
        }

    },[rootStore.holosticScheduleContentStore.edit.targetModel])

    const getModelContent = async(target=null)=>{
        if(target){
            await PrivateApi.get(`${modelContent?.apiUrl}/${target}/`).then((res)=>{
                // console.log(res.data)
            }).catch((error)=>{
                console.error(error)
            })
        }else{
            await PrivateApi.get(`${modelContent?.apiUrl}/`).then((res)=>{
                setResults(res.data)
                // console.log(res.data)
            }).catch((error)=>{
                console.error(error)
            })
        }
    }

    useEffect(()=>{
        if(rootStore.enableManagement&&rootStore.isManager()){

        }
    },[navigate])
    return(
        <Content
            className="H-content"
        >
            {
                nothingToDisplay&&
                <div className="no-content">
                    <p>No content to display</p>
                </div>
            }
            {!nothingToDisplay&&
            <div>
                {
                    toDisplay==='list'&&
                    <SearchResult results={results} model={modelContent}/>
                }
                {
                    toDisplay==='search'&&
                    <SearchResult results={results} model={modelContent}/>
                }
                {
                    toDisplay==='add'&&rootStore.enableManagement&&rootStore.isManager()&&
                    <Add model={modelContent}/>
                }
                {
                    toDisplay==='detail'&&rootStore.enableManagement&&rootStore.isManager()&&
                    <Details/>
                }
                {
                    toDisplay==='edit'&&rootStore.enableManagement&&rootStore.isManager()&&
                    <Edit/>
                }
            </div>
            }

        </Content>
    )
})
export default HContent;