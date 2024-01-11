import { useEffect, useState } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import axios from 'axios';

import { SERVER_PATH } from '../config';
import { globalStyles } from '../utils';
import { Sensor } from './Sensor';

export function SensorTab({ sensorData }) {
    const [sensor, setSensors] = useState([]);
    
    useEffect(() => {
        setSensors(sensorData);
    }, [sensorData]);

    return(
        <View style={styles.container}>
            <Text style={globalStyles.text}>Bruh</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: 20,
      },
});