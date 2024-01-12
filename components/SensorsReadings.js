import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, useWindowDimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
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
        tabs = {};
        sensorsData.map((sensor) => {
            tabs[sensor.sensorID] = () => <SensorTab sensorData={sensor} />
        });
        setScenes(tabs);
    }, [sensorsData]);

    return(
        <View style={styles.container}>
            <Text style={globalStyles.h2}>Measurements</Text>
            {
                scenes.length != 0 && sensors.length != 0 && 
                <TabView
                    navigationState={{ 
                        index, 
                        routes: sensors.map((sensor) => ({ key: sensor.sensorID, title: sensor.name })) 
                    }}
                    renderScene={SceneMap(scenes)}
                    onIndexChange={setIndex}
                    initialLayout={{ width: '100%' }}
                    renderTabBar={props => <TabBar {...props} style={styles.customTabBar}/> }
                />
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
    customTabBar: {
        backgroundColor: '#14213d',
        color: '#14213d',
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#FCA311',
    },
});