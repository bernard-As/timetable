import { Col, Dropdown, Row, Tooltip } from "antd";
import { FcFilledFilter } from "react-icons/fc";
import analisysStore from "../../mobx/AnalisysStore";
import { observer } from "mobx-react";
import General from "./General";
import Lecturer from "./Lecturer";
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
                            <FcFilledFilter size={22}/>
                        </Tooltip>
                    </Dropdown>
                </Col>
            </Row>

            <General/>
            <Lecturer/>
        </div>
    )    
})
export default Content;