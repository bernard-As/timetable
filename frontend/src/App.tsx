import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Login } from './login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import P404 from './components/404page';
import Navigation from './components/navigationBar/Navigation';
import TokenChecker from './tokenChecker';
import {Provider} from 'react-redux'
import { store } from './store';
import SiteManagement from './components/siteMnagement/main';
import StoreChecker from './storeChecker';
function App() {
  return (
    <div className="App">
      <Provider store={store} >
      <Router>
        <TokenChecker />
        <StoreChecker/>
        <Navigation/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/siteManagement' element={<SiteManagement />}/>
          <Route path='*' element={<P404 />}/>
        </Routes>
      </Router>
      </Provider>
    </div>
  );
}

export default App;
