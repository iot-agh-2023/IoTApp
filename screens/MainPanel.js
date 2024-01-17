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
import { ScrollView } from 'react-native-gesture-handler';


export default function MainPanel({ navigation, route }) {
    const [user, setUser] = useState();
    const [sensors, setSensors] = useState([]);

    // const [mySensors, setMySensors] = useState([]);
    // const [observedSensors, setObservedSensors] = useState([]);

    useEffect(() => {
      setUser(route.params);
      if (route.params) {
        handleGetUserSensors(route.params.userID);
    };
    }, [route.params])


    const handleGetUserSensors = async (id) => {
      try{
          const sensors = await axios
          .get(`${SERVER_PATH}/sensors/${id}`)
          .then(res => res.data, err => console.log(err));

          if (sensors){
              setSensors(sensors);
              // sensors.map((sensor) => {
              //   if (sensor.role == 2){
              //     setObservedSensors(observedSensors => [...observedSensors, sensor]);
              //   } else {
              //     setMySensors(mySensors => [...mySensors, sensor]);
              //   }
              // })
          }
      } catch (err) {
          console.log(err);
      }
  }

    return (
        <SafeAreaView style={styles.container}>
          {/* <ScrollView style={styles.scrollView}> */}
            <Text style={globalStyles.h1}>Hi, { user && user.username}</Text>
            <Divider />
            {
              user && <UserSensors title="All Devices" sensorsData={sensors}/>
            }
            <Divider />
            {
              user && <SensorsReadings sensorsData={sensors}/>
            }
            

          {/* <Text>SSID: {ssid}</Text> */}
          <StatusBar style="auto" />
          {/* </ScrollView> */}
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