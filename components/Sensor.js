import { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

export function Sensor({ info }) {
    const [deviceInfo, setDeviceInfo ] = useState({});
    useEffect(() => {
        setDeviceInfo(info);
    }, [info]);

    return (
        <View style={styles.deviceContainer}>
            <View style={styles.deviceInfo}>
                <Text style={styles.title}>{deviceInfo.name}</Text>
                <Text style={styles.info}>ID: {deviceInfo.sensorID}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    deviceContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#14213D',
    },
    deviceInfo: {
        width: '100%',
        padding: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    info: {
        color: '#FFFFFF',
        fontSize: 12,
    }
});