import { Content } from "antd/es/layout/layout";
import rootStore from "../../mobx";
import ContentRoutes from "../ContentsRoutes";

const DynamicContent:React.FC =()=>{

    return (
        <Content
            className="content"
            style={{
                backgroundColor:rootStore.mainStore.darkMode?'#331f12bb':'#f7e9e0bb'
            }}
        >
            <div
                className="sub-content"
            >

                <ContentRoutes/>

            </div>
        </Content>
    )

}
export default DynamicContent;