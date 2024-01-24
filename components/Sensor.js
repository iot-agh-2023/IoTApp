import { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { SERVER_PATH } from '../config';

export function Sensor({ userID, info }) {
    const [deviceInfo, setDeviceInfo ] = useState({});
    const [user, setUserID] = useState(userID);

    useEffect(() => {
        setDeviceInfo(info);
        setUserID(userID);
    }, [info, userID]);

    const handleDeleting = async () => {
        Alert.alert(
            "Delete device",
            "Are you sure you want to delete this device? This action will only disconnet you from the device. It will save all the data. To do factory reset go to section 'You Devices'. ",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteSensor();
                    }
                }
            ]
        )
    }

    const deleteSensor = async () => {
        try{
            const response = await axios.delete(
                `${SERVER_PATH}/linkages/${user}/${deviceInfo.sensorID}`
            );
            console.log(response.data.message);
            setDeviceInfo(null);
        } catch (err){
            console.log(err)
        }
        console.log("deleting sensor: ", deviceInfo.sensorID)
    }

    return (
        <View>
        {
            deviceInfo === null ? null
            : <View style={styles.deviceContainer}>
                 <View style={styles.deviceInfo}>
                    <Text style={styles.title}>{deviceInfo.name}</Text>
                    <Text style={styles.info}>ID: {deviceInfo.sensorID}</Text>
                </View>
                <View style={styles.deviceInfoRight}>
                {
                    deviceInfo.role == 1 ? <Text style={styles.info}>Role: Admin</Text> 
                    : <Text style={styles.info}>Role: User</Text>
                }
                <AntDesign name="delete" size={24} color="white" onPress={() => handleDeleting()}/>
                </View>
             </View>
        }
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