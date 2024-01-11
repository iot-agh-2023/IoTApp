import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

import { SERVER_PATH } from '../config.js';
import { Divider } from '../components/Divider.js';
import { globalStyles } from '../utils.js';
import { UserSensors } from '../components/UsersSensors.js';
import { SensorsReadings } from '../components/SensorsReadings.js';

export default function MainPanel({ navigation, route }) {
    const [user, setUser] = useState();
    const [sensors, setSensors] = useState([]);

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
          }
      } catch (err) {
          console.log(err);
      }
  }
    // const [wifiList, setWifiList] = useState([]); // [ { ssid: 'ssid', bssid: 'bssid', capabilities: 'capabilities', level: 'level', frequency: 'frequency', timestamp: 'timestamp' }
    // const [ssid, setSSID] = useState('');

    return (
        <View style={styles.container}>
          <Text style={globalStyles.h1}>Hi, { user && user.username}</Text>
          <Divider />
          {
            user && <UserSensors sensorsData={sensors} />
          }
          <Divider />
          {
            user && <SensorsReadings sensorsData={sensors}/>
          }

        {/* <Text>SSID: {ssid}</Text> */}
        <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: 20,
    },
    h1: {
      width: '100%',
      marginBottom: 20,
      paddingBottom: 5,
      fontSize: 25,
      fontWeight: 'bold',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
    }
  });