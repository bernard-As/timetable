import Alert from './alerts/normalAlert';
import { TbError404 } from "react-icons/tb";
const NotFound = () => {
  return (
    <center>
    <div style={{marginTop:'15%'}}>
        <Alert title='Page Not found' icon='warning'/>
        <TbError404 size={100}/>
      <h1>Page Not Found</h1>
    </div>
    </center>
  );
};

export default NotFound;
