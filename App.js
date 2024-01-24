import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainPanel from './screens/MainPanel.js';
import Profile from './screens/Profile.js';
import ConnectDevice from './screens/ConnectDevice.js';
import ConnectUser from './screens/ConnectUser.js';
import YourDevices from './screens/YourDevices.js';

import DailyReadings from './screens/DailyReadings.js';
import WeeklyReadings from './screens/WeeklyReadings.js';
import MonthlyReadings from './screens/MonthlyReadings.js';

import Register from './screens/Register.js';
import Login from './screens/Login.js';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Main({ route }) {
  return(
    <Drawer.Navigator initialRouteName='MainPanel'>
      <Drawer.Screen name="Main Panel">
        {props => <MainPanel {...props} route={route} />}
      </Drawer.Screen>
      <Drawer.Screen name="Your Devices">
        {props => <YourDevices {...props} route={route} />}
      </Drawer.Screen>
      <Drawer.Screen name="Connect Device">
        {props => <ConnectDevice {...props} route={route} />}
      </Drawer.Screen>
      <Drawer.Screen name="Connect User">
        {props => <ConnectUser {...props} route={route} />}
      </Drawer.Screen>
      <Drawer.Screen name="Daily Measurements">
        {props => <DailyReadings {...props} route={route} />}
      </Drawer.Screen>
      <Drawer.Screen name="Weekly Measurements">
        {props => <WeeklyReadings {...props} route={route} />}
      </Drawer.Screen>
      <Drawer.Screen name="Monthly Measurements">
        {props => <MonthlyReadings {...props} route={route} />}
      </Drawer.Screen>
      <Drawer.Screen name="Profile">
        {props => <Profile {...props} route={route} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={Main}/>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
