import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

import { SERVER_PATH } from '../config.js';
import { globalStyles } from '../utils.js';
import { PreviousReadingSensor } from '../components/PreviousReadingsSensor.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

export default function MonthlyReadings({ navigation, route }) {
    const [sensors, setSensors] = useState([]);

    useEffect(() => {
        if (route.params) {
            handleGetUserSensors(route.params.userID);
        }
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
            {
                !!sensors.length != 0 ? sensors.map((sensor, index) => {
                    return(
                        <PreviousReadingSensor key={index} sensorData={sensor} mode='monthly'/>
                    )})
                : <Text style={globalStyles.h2}>No sensors found</Text>
            }
            <StatusBar style="auto" />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: StatusBar.currentHeight,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    scrollView: {
        // marginHorizontal: 20,
        width: '100%',
    },
  });