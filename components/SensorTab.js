import { useEffect, useState } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import axios from 'axios';

import { SERVER_PATH } from '../config';
import { globalStyles } from '../utils';

export function SensorTab({ sensorData }) {
    const [reading, setReading] = useState({});
    
    useEffect(() => {
        if (sensorData){
            handleGetNewestSensorReading(sensorData.sensorID);
        }
    }, [sensorData]);

    const handleGetNewestSensorReading = async (id) => {
        try{
            const read = await axios
            .get(`${SERVER_PATH}/readings/${id}/newest`)
            .then(res => res.data, err => console.log(err));

            if (read){
                setReading(read);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={globalStyles.h2}>Temperature</Text>
            { reading != undefined && <Text style={globalStyles.specialText}>{reading.temperature} ℃</Text> }
            <Text style={globalStyles.h2}>Humidity</Text>
            { reading != undefined && <Text style={globalStyles.specialText}>{reading.humidity} %</Text> }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: 20,
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
});