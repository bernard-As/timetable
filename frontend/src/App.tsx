import React, { useEffect, useState } from 'react';
import './App.css';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import MainRoutes from './Routes';
import Notifications from './components/Notification';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time delay (e.g., 2 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Cleanup timer if component unmounts before the timeout
    return () => clearTimeout(timer);
  }, []);
  

  return (
    <div className="App">
      <Notifications/>
      { 
        loading ? (
          <Spin indicator={<LoadingOutlined spin />} size="large" fullscreen/>
        ) : (
          <MainRoutes/>
        )
      }
    </div>
  );
}

export default App;
