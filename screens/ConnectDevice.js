import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, TextInput } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import * as ExpoDevice from "expo-device";
import base64 from 'react-native-base64';

import { PrimaryButton } from '../components/PrimaryButton.js';
import { globalStyles } from '../utils.js';
import { Divider } from '../components/Divider.js';
import useBLE from '../useBLE.js';

// const manager = new BleManager();
const SERVICE_UUID = '18902a9a-1f4a-44fe-936f-14c8eea41801';
const SSID_CHARACTERISTIC_UUID = 'be3942ad-485c-4fce-9bce-110c2ec28897';

export default function ConnectDevice({ navigation, route }) {
    const [userID, setUserID] = useState('');
    const [ssid, setSSID] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setUserID(route.params.userID);
    }, [route.params]);


    const {
        scanForPeripherals,
        requestPermissions,
        allDevices,
        connectToDevice,
        connectedDevice
    } = useBLE();

    const scanForDevices = async () => {
        const isPermissionsEnabled = await requestPermissions();
        if(isPermissionsEnabled){
          scanForPeripherals();
        }
      }
  

    return (
        <View style={styles.container}>
            <Text style={styles.h2}>Connect new device</Text>
            {
                isConnected ? <Text style={globalStyles.text}>Connected to {connectedDevice.id}</Text> : <Text style={globalStyles.text}>Not connected</Text>
            }
            {
                !!allDevices.length != 0 && allDevices.map((device, index) => {
                    return(
                        <View key={index} style={styles.deviceContainer}>
                            <View style={styles.deviceInfo}>
                                <Text style={styles.title}>{device.name}</Text>
                                <Text style={styles.info}>ID: {device.id}</Text>
                            </View>
                            <PrimaryButton text='Connect' onPress={connectToDevice(device)} mode='light'/>
                            {/* <PrimaryButton text='Disconnect' onPress={() => disconnectFromDevice()} mode='light'/> */}
                        </View>                           )
                })
            }
            <PrimaryButton text='Scan' onPress={scanForDevices} />
            <Divider />
            <Text style={styles.h2}>Send data</Text>
            <TextInput 
              style={globalStyles.input}
              placeholder='SSID'
              onChangeText={text => setSSID(text)}
              defaultValue={ssid}
            />
            <TextInput 
                style={globalStyles.input}
                placeholder='Password'
                onChangeText={text => setPassword(text)}
                defaultValue={password} 
            />

            <StatusBar style="auto" />  
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    btnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginTop: 20,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '60%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
    },
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