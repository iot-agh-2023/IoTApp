import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import axios from 'axios';

import { SERVER_PATH } from '../config';
import { globalStyles } from '../utils';
import { SensorTab } from './SensorTab';

export function SensorsReadings({ sensorsData }) {
    const [sensors, setSensors] = useState([]);
    const [index, setIndex] = useState(0);
    const [scenes, setScenes] = useState({});

    useEffect(() => {
        setSensors(sensorsData);
        console.log(sensors);

    }, [sensorsData]);

    useEffect(() => {
        if (sensors) {
            tabs = {};
            sensors.map((sensor) => {
                tabs[sensor.sensorID] = <SensorTab sensorData={sensor} />
            });
            setScenes(tabs);
            console.log(tabs);
        }
    }, [sensors]);

    return(
        <View style={styles.container}>
            <Text style={globalStyles.h2}>Measurements</Text>
            {
                scenes ? 
                <TabView
                    navigationState={{ 
                        index, 
                        routes: sensors.map((sensor) => ({ key: sensor.sensorID, title: sensor.name })) 
                    }}
                    renderScene={SceneMap(scenes)}
                    onIndexChange={setIndex}
                    initialLayout={{ width: '100%' }}
                />
                : <Text style={globalStyles.text}>No sensors found</Text>
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: 20,
        flex: 1,
        width: '100%',
      },
});