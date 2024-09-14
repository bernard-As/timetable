import { Card, Col, GetProps, Input, InputRef, Row, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import { Header } from "antd/es/layout/layout";
import { useEffect, useRef } from "react";
import { TfiLayoutAccordionList } from "react-icons/tfi";
import { FaStar,FaRegStar } from "react-icons/fa6";
import { FaPlus,FaSearch } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
const HHeader:React.FC=()=>{
    const inputRef = useRef<InputRef>(null);
    type SearchProps = GetProps<typeof Input.Search>;
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(info?.source, value)
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
                    {   window.innerWidth >768&&<Col span={16}>
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
                        window.innerWidth<768&&<Col span={1}>
                            <Tooltip 
                                title="Search"
                            >
                                <FaSearch size={20}/>
                            </Tooltip>
                        </Col>
                    }
                    <Col span={1}>
                        <Tooltip 
                            title="List"
                        >
                            <TfiLayoutAccordionList size={20}/>
                        </Tooltip>
                    </Col>
                    <Col span={1}>
                        <Tooltip 
                            title="Add"
                        >
                            <FaPlus  size={20}/>
                        </Tooltip>
                    </Col>
                    <Col span={1}>
                        <Tooltip 
                            title="Delete"
                        >
                            <RiDeleteBin5Line  size={20}/>
                        </Tooltip>
                    </Col>
                    <Col span={1}>
                        <Tooltip 
                            title="Marked"
                        >
                            {/* <FaRegStar size={20}/> */}
                            <FaStar  size={20}/>
                        </Tooltip>
                    </Col>
                </Row>
            </Card>
        </Header>
    )
}

export default HHeader;