import { useEffect, useState } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { SecondaryButton } from './SecondaryButton';
import { PrimaryButton } from './PrimaryButton';


export function Device({ info, connectFunction }) {
    const [deviceInfo, setDeviceInfo ] = useState({});
    useEffect(() => {
        setDeviceInfo(info);
    }, [info]);

    return (
        <View style={styles.deviceContainer}>
            <View style={styles.deviceInfo}>
                <Text style={styles.title}>{deviceInfo.name}</Text>
                <Text style={styles.info}>ID: {deviceInfo.id}</Text>
            </View>
            <PrimaryButton text='Connect' onPress={connectFunction} mode='light'/>
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
        width: '50%',
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