import React from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useSelector } from 'react-redux';
import BottomTabs from './BottomTabs';


const Routes = () => {
     const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
     console.log("isLoggedIn",isLoggedIn)
    return isLoggedIn ? <AppStack /> : <AuthStack />;
};

export default Routes;
