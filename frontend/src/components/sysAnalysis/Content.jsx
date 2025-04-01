import { Button, Col, Dropdown, Row, Tooltip } from "antd";
import { FcFilledFilter } from "react-icons/fc";
import analisysStore from "../../mobx/AnalisysStore";
import { observer } from "mobx-react";
import General from "./General";
import Lecturer from "./Lecturer";
import Room from "./Room";
const Content = observer(()=>{
    return (
        <div>
            <Row>
                <Col span={5}>
                    <Dropdown trigger={['click']} 
                        menu={{
                            items:analisysStore.items,
                            onClick:(e)=>analisysStore.selectAnalisysType(e)
                        }}
                        
                    >
                        <Tooltip title="Select">
                            <Button
                                icon = {<FcFilledFilter size={22}/>}
                                label={'Menu'}
                            ></Button>
                            
                        </Tooltip>
                    </Dropdown>
                </Col>
            </Row>

            {analisysStore.selectedAnalisysType==='general'&&<General/>}
            {analisysStore.selectedAnalisysType==='lecturer'&&<Lecturer/>}
            {analisysStore.selectedAnalisysType==='room'&&<Room/>}
        </div>
    )    
})
export default Content;