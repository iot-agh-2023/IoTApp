import { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { SERVER_PATH } from '../config';

export function Sensor({ info }) {
    const [deviceInfo, setDeviceInfo ] = useState({});
    useEffect(() => {
        setDeviceInfo(info);
    }, [info]);

    const handleDeleting = async () => {
        // try{
        //     const response = await axios.delete(
        //         `${SERVER_PATH}/sensors/${deviceInfo.sensorID}`
        //     );
        // } catch (err){
        //     console.log(err)
        // }
        console.log("deleting sensor: ", deviceInfo.sensorID)

    }

    return (
        <View style={styles.deviceContainer}>
            <View style={styles.deviceInfo}>
                <Text style={styles.title}>{deviceInfo.name}</Text>
                <Text style={styles.info}>ID: {deviceInfo.sensorID}</Text>
            </View>
            <View style={styles.deviceInfoRight}>
            {
                deviceInfo.role == 1 ? <Text style={styles.info}>Role: Admin</Text> 
                : <Text style={styles.info}>Role: User</Text>
            }
            {
                deviceInfo.role == 1 && <AntDesign name="delete" size={24} color="white" onPress={() => handleDeleting()}/>
            }
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
        width: '50%',
        padding: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    deviceInfoRight: {
        width: '50%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
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