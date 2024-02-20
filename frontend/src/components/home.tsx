import React, { useEffect, useState } from 'react';
import TokenChecker from '../tokenChecker';
import StoreChecker from '../storeChecker';
import TopNavigation from './navigationBar/topNavigation'
import {loginSuccess, setGroup} from '../store'
import { useDispatch, useSelector } from 'react-redux';

const Home: React.FC = () =>{
    const titles = useSelector((state: any)=>state.titles)
    console.log(titles)
    return (
        <>
        <TopNavigation/>
        </>
    );
}
export default  Home;