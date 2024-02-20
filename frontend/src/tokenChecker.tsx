import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import Alert from './components/alerts/normalAlert';

const TokenChecker = () => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  useEffect(() => {
    const checkToken = async () => {
      // Perform asynchronous operations, e.g., fetch user data based on the token
      if (!token) {
        setTimeout(() =>{
          console.log('here')
            // navigate('/login');
        },3000)
      }
    };

    // Call the async function
    checkToken();
  }, [navigate]);

  // Render a loading message or spinner during the token check
  return <div>{!token && <Alert title="Unauthorized Access" icon="error"/>}</div>;
};

export default TokenChecker;
