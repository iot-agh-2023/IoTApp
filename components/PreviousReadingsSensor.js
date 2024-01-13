import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { globalStyles, COLORS } from '../utils';
import { Divider } from './Divider';
import { ReadingsPlots } from './ReadingsPlots';


export function PreviousReadingSensor({ sensorData }) {
    const [sensor, setSensor] = useState({}); 

    useEffect(() => {
        if (sensorData){
            setSensor(sensorData);
        }
        
    }, [sensorData]);

    return(
        <View style={styles.container}>
            <View style={styles.header}><Text style={[globalStyles.h1, styles.title]}>{sensor.name}</Text></View>
            {  sensor && <ReadingsPlots sensorID={sensor.sensorID} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: 20,
        flex: 1,
        padding: 20,
        paddingTop: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
    header: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: COLORS.primary,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        borderBottomColor: COLORS.white,
        borderBottomWidth: 3,
    },
    title: {
        color: COLORS.white,
        marginBottom: 0,
        paddingBottom: 8,
        paddingTop: 8,
    },
    customTabBar: {
        backgroundColor: '#14213d',
        color: '#14213d',
        borderBottomWidth: 1,
        borderBottomColor: '#FCA311',
    },
});