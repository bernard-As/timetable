import { Content } from "antd/es/layout/layout";
import { useEffect } from "react";

 
const HContent:React.FC<{stopLoadingf:any}> =({stopLoadingf})=>{
    useEffect(()=>{
        stopLoadingf(false);
    },[stopLoadingf])
    return(
        <Content
            className="H-content"
        >
            Helloca
        </Content>
    )
}
export default HContent;