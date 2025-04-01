import { useEffect, useState } from "react";
import rootStore from "../../mobx";
import { Button, Drawer, FloatButton, Space, Tag, Tooltip } from "antd";
import { GrSystem } from "react-icons/gr";
import { observer } from "mobx-react";
import { VscDebugRerun } from "react-icons/vsc";
import Content from "./Content";
const SystemAnalisys = observer(() => {
    const [showSystemAnalysis, setShowSystemAnalysis] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    useEffect(()=>{
        console.log('systemAnalysis',rootStore.holisticScheduleStore.checkCredentialAllowence('systemAnalysis'));
        console.log(rootStore.credential);
        
        if(rootStore.holisticScheduleStore.checkCredentialAllowence('systemAnalysis')
        &&rootStore.holisticScheduleStore.checkAllowDisplay('systemAnalysis')){
            setShowSystemAnalysis(true);
        }
    },[rootStore.credential])
    const onClose = () => {
        setOpenDrawer(false);
    };
  return (
    <div>
      {showSystemAnalysis&&<Tooltip title="System Analysis">
        <FloatButton
          size="large"
          badge={{
            dot: true,
          }}
          icon={<GrSystem size={28} color="gold"/>}
          style={{
            backgroundColor: "black",
            color: "white",
            insetInlineEnd: 94,
          }}
            onClick={() => {
                setOpenDrawer(true);
            }}
        />
        </Tooltip>}

        <Drawer
        title={`System Analysis (avalable for only Final Exam)`}
        placement="right"
        size={'large'}
        onClose={onClose}
        open={openDrawer}
        extra={
          <Space>
            <Tag color="gold">Set on Midterms</Tag>
            {/* <Button 
                onClick={onClose}
                icon={<VscDebugRerun color="green"/>}
                type={"text"}
                backgroundColor={"rgba(150, 44, 12, 0.57)"}
                // loading
            >
              Run all
            </Button> */}
            <Button type={'primary'} danger ghost onClick={onClose}>Close</Button>
            </Space>
        }
      >
        <Content/>
      </Drawer>
    </div>
  );
})

export default SystemAnalisys;