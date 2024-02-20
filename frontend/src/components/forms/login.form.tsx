import React, { useEffect, useState } from 'react';
import Alert from '../alerts/normalAlert';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setGroup } from '../../store';
import StoreChecker from '../../storeChecker';
const LoginForm: React.FC = () =>{
  const dispatch = useDispatch()

  const navigate = useNavigate();
    useEffect(() => {
    const existToken = Cookies.get('token')
        if (existToken) {
            // navigate('/');
        }
    }, [navigate]);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showAlert, setShowAlert] = useState(false);
    const [errorStatus, setErrorStatus] = useState(0);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const setUserGroup = (g:string) =>{
      dispatch(setGroup({group: g}))
    }

    const handleSubmit = async (e: any) => {
      e.preventDefault();
    
      try {

        const response = await axios.post('http://localhost:8000/api/login/', formData);
        setErrorStatus( response.status);
        setShowAlert(true);
        const token = response.data.token;
        console.log(response)
        Cookies.set("token", token,  { expires: 900000000 });
        // dispatch(setGroup('visitor'))
        navigate('/')
        // Set the token in a cookie
        // setCookie('token', token, { path: '/', maxAge: 3600 });
        
        console.log(response.status );
      } catch (error: any) {
        if (!error?.response) 
        setErrorStatus(0);
        else
        setErrorStatus(error.response.status);
        setShowAlert(true);
        
      }
    };
    useEffect(() => {
      // This effect will run when showAlert becomes true
      if (showAlert) {
        // Automatically hide the alert after 3000 milliseconds (3 seconds)
        const timeoutId = setTimeout(() => {
          setShowAlert(false);
        }, 3000);
  
        // Clean up the timeout when the component unmounts or when showAlert becomes false
        return () => clearTimeout(timeoutId);
      }
    }, [showAlert]);
    return (
        <div className="Auth-form-container">
        {
          showAlert && (
            (errorStatus === 400 && (
            <Alert title='Please fill the field' icon = 'warning' />
          ))
          ||( errorStatus === 401 && (
            <Alert title='Invalid credentials' icon = 'warning' />
          ))
          || (errorStatus === 500 && (
            <Alert title='Server Error' icon = 'warning' />
          ))
          || (errorStatus === null && (
            <Alert title='Server Error' icon = 'warning' />
          ))
          || (errorStatus === 0 && (
            <Alert title='Could not connect to the server' icon = 'warning' />
          ))
          || (errorStatus === 200 && (
            <>
            <StoreChecker/>
            <Alert title='Welcome Back' icon = 'success' />
            </>
          )
          ))
        }
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="form-group mt-3">
              <label>Email address / Student Number / Username</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Login"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password (if setted)</label>
              <input
                type="password"
                className="form-control mt-1"
                value={formData.password}
                placeholder="Enter password"
                name="password"
                onChange={handleChange}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button 
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
               >
                Submit
              </button>
            </div>
            <p className="text-center mt-2">
              Forgot <a href="#">password?</a>
            </p>
            <p className='text-center mt-2'>
                Don't have an account contact your Advisor
            </p>
          </div>
        </form>
      </div>
    );
}
export default LoginForm;