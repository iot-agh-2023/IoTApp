import { useEffect, useState } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import axios from 'axios';

import { SERVER_PATH } from '../config';
import { globalStyles } from '../utils';
import { Sensor } from './Sensor';

export function UserSensors({ sensorsData }) {
    const [sensors, setSensors] = useState([]);
    
    useEffect(() => {
        setSensors(sensorsData);
    }, [sensorsData]);


    return (
        <View style={styles.container}>
            <Text style={globalStyles.h2}>Your devices</Text>
            {
                !!sensors.length != 0 ? sensors.map(sensor => {
                    return (
                        <Sensor key={sensor.sensorID} info={sensor} />
                    );
                }) :
                <Text>You have no sensors connected :c{'\n'}You can add new device in "Connect Device" section! </Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: 20,
      },
});