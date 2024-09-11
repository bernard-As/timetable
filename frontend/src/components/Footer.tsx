import { Footer } from "antd/es/layout/layout"

const DynamicFooter:React.FC = ()=>{
    return (
        <Footer style={{ textAlign: 'center' }}
            className="footer"
        >
            RDU ©{new Date().getFullYear()} Created by Bernard Assogba
        </Footer>
    )
}
export default DynamicFooter;