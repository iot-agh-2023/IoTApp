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

const manager = new BleManager();
const SERVICE_UUID = 'be3942ad-485c-4fce-9bce-110c2ec28897';
const SSID_CHARACTERISTIC_UUID = '18902a9a-1f4a-44fe-936f-14c8eea41801';

export default function ConnectDevice({ navigation, route }) {
    const [userID, setUserID] = useState('');
    const [ssid, setSSID] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setUserID(route.params.userID);
    }, [route.params]);

    const deviceRef = useRef(null);

    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    
    const [deviceList, setDeviceList] = useState([]);
    const [deviceID, setDeviceID] = useState('');

    const [sendCommand, setSendCommand] = useState('test');
    const [decodedCommad, setDecodedCommand] = useState('');



    // SCAN----------------------------------------------------------------------------------------------------------------

    const startScan = async () => {
        setIsScanning(true);
        let list = [];

        console.log('Scanning...');
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return; 
            }
            const hasID = list.some(item => item.id === device.id);

            if (!hasID && device.name?.includes('POCO X4 GT')) {
                // setDevice(device);
                setDeviceID(device.id);
                console.log('Found new device: ' + device.name);
                list.push(device);
                console.log(JSON.stringify(device, null, 2));
                setDeviceList(prev => [...prev, device]);

                setIsScanning(false);
                console.log('Scan stopped');
                manager.stopDeviceScan();  
            }
        });
    }

    const scan = async () => {
        const permissionResult = await requestPermissions();
        if(!permissionResult){
            console.log("Permission not granted");
            return;
        }
        console.log("Permission granted");
        startScan();
    }

    const stopScan = () => {
        setIsScanning(false);
        console.log('Scan stopped');
        manager.stopDeviceScan();
    }

    // CONNECT-------------------------------------------------------------------------------------------------------------------


    const connect = async (device) => {
        device
        .connect({requestMTU: 64})
        .then(async connectedDevice => {
            setDeviceID(device.id)
            console.log('Connected to ' + connectedDevice.id);
            setIsConnected(true);
            deviceRef.current = connectedDevice;
            writeMessage(connectedDevice, SERVICE_UUID, 'test')
        })
        .catch(error => {
            console.log('Connection error 1:', error)
        })
    }


    // SEND----------------------------------------------------------------------------------------------------------------

    const writeMessage = async (device, uuidPattern, value) => {
        device.discoverAllServicesAndCharacteristics()
        .then(async (deviceWithServices) => {
            return await deviceWithServices.services()
        })
        .then(async (services) => {
            const serviceUUID = matchService(services, uuidPattern)
            if (serviceUUID == null) {
                throw new Error("Service not found");
            }
            console.log("Service UUID: " + serviceUUID);
            return await device.characteristicsForService(serviceUUID)
        })
        .then((characteristics) => {
            device.writeCharacteristicWithoutResponseForService(characteristics[0].serviceUUID, characteristics[0].uuid, base64.encode(value))
            console.log('Message sent');
            return true;
        })
        .catch(error => {
            console.log('Write error 2: ', error)
        })
    }

    const matchService = (services, uuidPattern) => {
        var serviceUUID = null;
        services.forEach(ser => {
            if (ser.uuid.includes(uuidPattern)) {   
                const customService = ser.uuid;
                serviceUUID = customService;
            }
        })
        return serviceUUID;
    }


    // const sendSSID = async (device) => {
    //     // manager.cancelTransaction('LISTEN')
    //     console.log("sending ...")
    //     const encodedSSID = base64.encode(ssid);
    //     await device.writeCharacteristicWithoutResponseForService(deviceID, 'be3942ad-485c-4fce-9bce-110c2ec28897', '18902a9a-1f4a-44fe-936f-14c8eea41801', encodedSSID)
    //     console.log('SSID sent');
    //     // setTimeout(() => startMonitoring(), 200);
    // }

        

    // PERMISSIONS----------------------------------------------------------------------------------------------------------------

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
             PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
             {
                 title: "Bluetooth Scan Permission",
                 message: "This app requires bluetooth scaning",
                 buttonPositive: "OK"
             }
        ); 
 
        const bluetoothConnectPermission = await PermissionsAndroid.request(
             PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
             {
                 title: "Bluetooth Connecting Permission",
                 message: "This app requires bluetooth CONNECTING",
                 buttonPositive: "OK"
             }
         ); 
 
         const bluetoothFineLocationPermission = await PermissionsAndroid.request(
             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
             {
                 title: "Fine Location Permission",
                 message: "This app requires fine location",
                 buttonPositive: "OK"
             }
        ); 
 
        return (
             bluetoothScanPermission === "granted" &&
             bluetoothConnectPermission === "granted" &&
             bluetoothFineLocationPermission === "granted"
        );
     }
 
     const requestPermissions = async () => {
         if(Platform.OS === "android"){
             if((ExpoDevice.platformApiLevel ?? -1) < 31){
                 const granted = await PermissionsAndroid.request(
                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                     {
                         title: "Fine Location Permission",
                         message: "This app requires fine location",
                         buttonPositive: "OK"
                     }
                 )
                 return granted === PermissionsAndroid.RESULTS.GRANTED;
             } else {
                 const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
                 return isAndroid31PermissionsGranted;
             }
         }
         else{
             return true;
         }
     };


    return (
        <View style={styles.container}>
            <Text style={styles.h2}>Connect new device</Text>
            {
                isScanning ? <Text style={globalStyles.text}>Scanning...</Text> : <Text style={globalStyles.text}>Not scanning</Text>
            }
            {
                isConnected ? <Text style={globalStyles.text}>Connected to {deviceID}</Text> : <Text style={globalStyles.text}>Not connected</Text>
            }
            {
                !!deviceList.length != 0 && deviceList.map((device, index) => {
                    return(
                        <View key={index} style={styles.deviceContainer}>
                            <View style={styles.deviceInfo}>
                                <Text style={styles.title}>{device.name}</Text>
                                <Text style={styles.info}>ID: {device.id}</Text>
                            </View>
                            <PrimaryButton text='Connect / Send' onPress={() => connect(device)} mode='light'/>
                            {/* <PrimaryButton text='Disconnect' onPress={() => disconnectFromDevice()} mode='light'/> */}
                        </View>                           )
                })
            }
            <PrimaryButton text='Scan' onPress={scan} />
            <PrimaryButton text='Stop scan' onPress={stopScan} />
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