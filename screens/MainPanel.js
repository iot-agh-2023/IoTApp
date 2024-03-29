import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

import { SERVER_PATH } from '../config.js';
import { Divider } from '../components/Divider.js';
import { globalStyles } from '../utils.js';
import { UserSensors } from '../components/UsersSensors.js';
import { SensorsReadings } from '../components/SensorsReadings.js';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MainPanel({ navigation, route }) {
    const [user, setUser] = useState();
    const [sensors, setSensors] = useState([]);

    useEffect(() => {
      setUser(route.params);
      if (route.params) {
        handleGetUserSensors(route.params.userID);
    };
    }, [route.params])

    
    useEffect(() => {
      const interval = setInterval(async () => {
          await handleGetUserSensors(route.params.userID);
      }, 1000 * 10);
      return () => clearInterval(interval);
  }, []);

    const handleGetUserSensors = async (id) => {
      try{
          const sensors = await axios
          .get(`${SERVER_PATH}/sensors/${id}`)
          .then(res => res.data, err => console.log(err));

          if (sensors){
              setSensors(sensors);
          }
      } catch (err) {
          console.log(err);
      }
  }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={globalStyles.h1}>Hi, { user && user.username}</Text>
            <Divider />
            {
              user && <UserSensors navigation={navigation} userID={user.userID} title="All Devices" sensorsData={sensors}/>
            }
            <Divider />
            {
              user && <SensorsReadings sensorsData={sensors}/>
            }
            
          <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: 10,

    },

  });