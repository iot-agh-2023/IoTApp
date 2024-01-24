import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

import { SERVER_PATH } from '../config.js';
import { Divider } from '../components/Divider.js';
import { globalStyles } from '../utils.js';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function YourDevices({ navigation, route }) {
    const [user, setUser] = useState();
    const [sensors, setSensors] = useState([]);
    const [mySensors, setMySensors] = useState([]);

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
              let s = [];
              sensors.map((sensor) => {
                if (sensor.role == 1){
                    s.push(sensor);
                }
              })
            // console.log(s);
            setMySensors(s);
          }
      } catch (err) {
          console.log(err);
      }
  }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={globalStyles.h2}>You can edit your devices here</Text>
            {
              (user && mySensors !== undefined) ? mySensors.map((sensor) => {
                return (
                  <View key={sensor.sensorID}>
                    <Text style={globalStyles.h3}>{sensor.name}</Text>
                  </View>
                )
            }) : <Text style={globalStyles.h3}>No devices found</Text>
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