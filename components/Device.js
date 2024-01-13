import { useEffect, useState } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';


export function Device({ info, connectFunction }) {
    const [deviceInfo, setDeviceInfo ] = useState({});
    useEffect(() => {
        setDeviceInfo(info);
    }, [info]);

    const handleConnection = async (device) => {
        await connectFunction(device)
        .then(() => console.log('DUPA Connected to ' + device.id))
        .catch(error => console.log(error));
    }

    // const handleDisconnection = async (device) => {
    //     await device.cancelConnection()
    //     .then(() => console.log('DUPA Disconnected from ' + device.id))
    //     .catch(error => console.log(error));
    // }

    return (
        <View style={styles.deviceContainer}>
            <View style={styles.deviceInfo}>
                <Text style={styles.title}>{deviceInfo.name}</Text>
                <Text style={styles.info}>ID: {deviceInfo.id}</Text>
            </View>
            { deviceInfo && <PrimaryButton text='Connect' onPress={() => handleConnection(deviceInfo)} mode='light'/>}
            {/* { deviceInfo && <PrimaryButton text='Disconnect' onPress={() => handleDisconnection(deviceInfo)} mode='light'/>}             */}
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