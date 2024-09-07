import React from 'react';
import Alert from './alerts/normalAlert';
import { useNavigate } from 'react-router-dom';

interface RequestHandlerProps {
 status: number;
}

const RequestHandler: React.FC<RequestHandlerProps> = ({ status }) => {
   const navigate = useNavigate()
 if (status === 404)
    return <Alert title='Unsupported action' icon='warning' />
 else if (status === 405)
    return <Alert title='Unsupported action' icon='warning' />
 else if (status === 200)
    return <Alert title='Created Successfuly' icon='success' />
 else if (status === 201)
    return <Alert title='Created Successfuly' icon='success' />
 else if (status === 201)
    return <Alert title='Already exist' icon='error' />
 else if (status === 401 || status === 403){
    setTimeout(() => {
       navigate('/login')
    }, 2000);
    return (
      <>
        <Alert title='Unauthorize Access' icon='warning' />
        
      </>
    )
   }
 else if (status === 500)
    return <Alert title='Server error' icon='warning' />
 else if (status === 1)
    return <Alert title='Could not connect to the sever' icon='warning' />
 return <div></div>
}

export default RequestHandler;