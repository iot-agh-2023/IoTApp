import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton.js';
import { Device } from '../components/Device.js';

import useBLE from '../useBLE.js';

export default function ConnectDevice({ navigation, route }) {

    const [userID, setUserID] = useState('');

    const ssid = 'ONEPLUS_co_aphait'
    const password = 'jajebie'

    const {
        scanForPeripherals, 
        requestPermissions, 
        allDevices,
        connectToDevice,
        connectedDevice,
    } = useBLE();

    const scanForDevices = async () => {
      const isPermissionsEnabled = await requestPermissions();
      if(isPermissionsEnabled){
        scanForPeripherals();
      }
    }

    const openModel = () => {
        scanForDevices();
        console.log(allDevices.forEach(device => console.log(JSON.stringify(device, null, 2))));
    }

    useEffect(() => {
        setUserID(route.params.userID);
    }, [route.params]);

    return (
        <View style={styles.container}>
            <Text style={styles.h2}>Connect new device</Text>
            {
            allDevices && 
            allDevices.map(device => <Device key={device.id} info={device} connectFunction={connectToDevice} />)
            }
            <PrimaryButton text='Search' onPress={openModel} />
            {
                connectedDevice && <Text>Connected to {connectedDevice.name}</Text>
            }
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
  });