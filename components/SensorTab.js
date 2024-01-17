import { useEffect, useState } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import axios from 'axios';

import { SERVER_PATH } from '../config';
import { COLORS, globalStyles } from '../utils';

export function SensorTab({ sensorData }) {
    const [reading, setReading] = useState({});
    
    useEffect(() => {
        if (sensorData){
            handleGetNewestSensorReading(sensorData.sensorID);
        }
    }, [sensorData]);

    useEffect(() => {
        const interval = setInterval(async () => {
            await handleGetNewestSensorReading(sensorData.sensorID);
        }, 1000 * 60);
        return () => clearInterval(interval);
    }, []);

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
            { reading.temperature != null ? <Text style={globalStyles.specialText}>{reading.temperature} ℃</Text>
            :   <Text style={globalStyles.specialText}>No data</Text> 
            }
            <Text style={globalStyles.h2}>Humidity</Text>
            { reading.humidity != null ? <Text style={globalStyles.specialText}>{reading.humidity} %</Text>
            :   <Text style={globalStyles.specialText}>No data</Text> 
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
      },
});