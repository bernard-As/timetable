import { Button, Form, InputNumber, Modal, Upload } from "antd";
import { observer } from "mobx-react";
import scanStore from "../../../../mobx/ScanStore";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
const ScanModal = observer(()=>{
    const handleUpload = (values) => {
        scanStore.handleSubmitForScan(values);
    };

    return (
        <Modal 
            title="Upload Image" 
            open={scanStore.showScanModal} 
            onCancel={()=>scanStore.handleSetShowModaLScan()}
            okButtonProps={{style: {display: 'none'}}}
        >
            <Form layout="vertical" onFinish={handleUpload}>
                <Form.Item 
                    label="Upload Image" 
                    name="image" 
                    valuePropName="fileList" 
                    getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                    rules={[{ required: true, message: 'Please upload an image!' }]}
                >
                    <Upload.Dragger 
                        name="files" 
                        beforeUpload={() => false} 
                        maxCount={1}
                    >
                        <p className="ant-upload-drag-icon">
                            <HiOutlineInboxArrowDown size={50}/>
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single upload.</p>
                    </Upload.Dragger>
                </Form.Item>
                <Form.Item 
                    label="Student ID" 
                    name="student_char" 
                    rules={[{ required: true, message: 'Please input the student ID!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Upload</Button>
                </Form.Item>
            </Form>
        </Modal>)
})
export default ScanModal;