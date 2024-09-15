import { Card, Col, GetProps, Input, InputRef, Row, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import { Header } from "antd/es/layout/layout";
import { useEffect, useRef } from "react";
import { TfiLayoutAccordionList } from "react-icons/tfi";
import { FaStar,FaRegStar } from "react-icons/fa6";
import { FaPlus,FaSearch } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import rootStore from "../../../mobx";
import { observer } from "mobx-react";
const HHeader:React.FC<{setToDisplay:any,setsearchData:any}> = observer(({setToDisplay,setsearchData})=>{
    const location = useLocation();
    const model = rootStore.holisticScheduleStore.getModelName(location)
    const inputRef = useRef<InputRef>(null);
    type SearchProps = GetProps<typeof Input.Search>;
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(info?.source, value)
        if(value.trim()!==(""||null)){
            setsearchData(value.trim())
        }
    };
    useEffect(()=>{
        const focusOnSearch=()=>{
            if(inputRef.current){
                inputRef.current!.focus({
                    cursor: 'all',
                });
            }
        }
        focusOnSearch();
    },[])
    

    return (
        <Header
            style={{backgroundColor:'transparent',
                padding:2,
                // paddingTop:5
            }}
        >
            <Card
                className="holistic-header"
            >
                
                <Row justify={'space-around'} style={{height:'20px'}}>
                    {   window.innerWidth >768&&
                        rootStore.holosticScheduleContentStore.header.find(h=>h.name===model)?.search &&
                        <Col span={16}>
                            <Search 
                            placeholder="input search text" 
                            onSearch={onSearch}
                            count={{
                                show:true,
                                max:20
                            }}
                            ref={inputRef}
                        />
                    </Col>}
                    {
                        window.innerWidth<768&&
                        rootStore.holosticScheduleContentStore.header.find(h=>h.name===model)?.search&&
                        <Col span={1}>
                            <Tooltip 
                                title="Search"
                            >
                                <FaSearch size={20}/>
                            </Tooltip>
                        </Col>
                    }
                    {   rootStore.holosticScheduleContentStore.header.find(h=>h.name===model)?.list&&
                        rootStore.enableManagement&&rootStore.isManager()&&
                        <Col span={1}>
                        <Tooltip 
                            title="List"
                        >
                            <TfiLayoutAccordionList size={20}
                                onClick={()=>{setToDisplay('list')}}
                                color="blue"
                            />
                        </Tooltip>
                    </Col>}
                    { rootStore.holosticScheduleContentStore.header.find(h=>h.name===model)?.add&&
                    rootStore.enableManagement&&rootStore.isManager()&&
                    <Col span={1}>
                        <Tooltip 
                            title="Add"
                        >
                            <FaPlus  size={20} 
                                onClick={()=>{setToDisplay('add')}}
                                color="green"
                            />
                        </Tooltip>
                    </Col>}
                    {rootStore.holosticScheduleContentStore.header.find(h=>h.name===model)?.delete&&
                    rootStore.enableManagement&&rootStore.isManager()&&
                    <Col span={1}>
                        <Tooltip 
                            title="Delete"
                        >
                            <RiDeleteBin5Line color="red" size={20}/>
                        </Tooltip>
                    </Col>}
                    {rootStore.holosticScheduleContentStore.header.find(h=>h.name===model)?.prefered&&
                    <Col span={1}>
                        <Tooltip 
                            title="Bookmark"
                        >
                            {/* <FaRegStar size={20}/> */}
                            <FaStar  size={20} color="#dbdf0b"/>
                        </Tooltip>
                    </Col>}
                </Row>
            </Card>
        </Header>
    )
})

export default HHeader;