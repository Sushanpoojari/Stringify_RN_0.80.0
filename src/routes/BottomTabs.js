import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard/Dashboard';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import CreatePost from '../screens/CreatePost/CreatePost';
import Profile from '../screens/Profile/Profile';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, height: 60 }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          )
        }}
      />
      {/* <Tab.Screen 
        name="Explore" 
        component={Dashboard} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="explore" color={color} size={size} />
          )
        }}
      /> */}
      <Tab.Screen 
        name="CreatePost" 
        component={CreatePost} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="code-slash-outline" color={color} size={size} />
          )
        }}
      />
      {/* <Tab.Screen 
        name="Profile" 
        component={Dashboard} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Octicons name="organization" color={color} size={size} />
          )
        }}
      /> */}
      {/* <Tab.Screen 
        name="Teams" 
        component={Dashboard} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          )
        }}
      /> */}
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
