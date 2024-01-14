import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState  } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, TextInput } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import * as ExpoDevice from "expo-device";
import base64 from 'react-native-base64';

import { PrimaryButton } from '../components/PrimaryButton.js';
import { Device } from '../components/Device.js';
import { globalStyles } from '../utils.js';
import { Divider } from '../components/Divider.js';



export default function ConnectDevice({ navigation, route }) {
    const [userID, setUserID] = useState('');
    const [ssid, setSSID] = useState('');
    const [password, setPassword] = useState('');
    // const ssid = '511A KW&NN'
    // const password = 'prosteHaslo'

    useEffect(() => {
        setUserID(route.params.userID);
    }, [route.params]);


    const [isScanning, setIsScanning] = useState(false);
    const [deviceList, setDeviceList] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    
    const [deviceID, setDeviceID] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [serviceID, setServiceID] = useState('');
    const [ssidCharacteristicID, setSsidCharacteristicID] = useState('');
    const [passCharacteristicID, setPassCharacteristicID] = useState('');


    const [sendCommand, setSendCommand] = useState('');


    const manager = new BleManager();

    // SCAN----------------------------------------------------------------------------------------------------------------

    const startScan = async () => {
        setIsScanning(true);
        let list = deviceList.slice();

        console.log('Scanning...');
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) { 
                console.log(error);
                return; 
            }
            const hasID = list.some(item => item.id === device.id);

            if (!hasID && device.name?.includes('OPPO')) {
                console.log('Found new device: ' + device.name);
                list.push(device);
                console.log(JSON.stringify(device, null, 2));
                setDeviceList(prev => [...prev, device]);
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

    const stopScan = async () => {
        setIsScanning(false);
        // setDeviceList([]);
        console.log('Scan stopped');
        manager.stopDeviceScan();
    }

    // CONNECT-------------------------------------------------------------------------------------------------------------------

    const connect = async (device) => {
        try{
            stopScan();
            // await manager.connectToDevice(device.id);
            await device.connect();
            setIsConnected(true);
            setDeviceID(device.id);
        } catch (error) {
            console.log(error);
        }
        // console.log('Connected to ' + device.name);

        await device.discoverAllServicesAndCharacteristics();
        const services = await device.services();

        services.forEach(async (service) => {
            // tu nasze uuid?
            if (service.uuid.includes('ffe0')) {
                const customService = service.uuid;
                setServiceID(customService);

                console.log('Custom service: ' + customService);
                const characteristics = await device.characteristicsForService(customService);

                characteristics.forEach( characteristic => {
                    // tu tez nasze uuid ?? idk o co chodzi do końca id charakterystyki która przyjmuje ssid?
                    if (characteristic.uuid.includes('ffe1')) {
                        const customCharacteristic = characteristic.uuid;
                        setSsidCharacteristicID(customCharacteristic);
                        console.log('Custom characteristic: ' + customCharacteristic);
                        setConnectedDevice(device);

                        // setTimeout(() => {
                        //     sendSSID();
                        // }, 1000);
                    }

                    // idk czy o to chodzi? charakterystyka która przyjmuje hasło?
                    if (characteristic.uuid.includes('ffe2')) {
                        const customCharacteristic = characteristic.uuid;
                        setPassCharacteristicID(customCharacteristic);
                        console.log('Custom characteristic: ' + customCharacteristic);
                        setConnectedDevice(device);

                        // setTimeout(() => {
                        //     sendPassword();
                        // }, 1000);
                    }
                });

            }
    
        });
    }


    // SEND----------------------------------------------------------------------------------------------------------------

    const sendSSID = async () => {
        const encodedSSID = base64.encode(ssid);
        await manager.writeCharacteristicWithResponseForDevice(deviceID, serviceID, ssidCharacteristicID, encodedSSID)
        console.log('SSID sent');
        // setTimeout(() => startMonitoring(), 200);
    }

    const sendPassword = async () => {
        const encodedPassword = base64.encode(password);
        await manager.writeCharacteristicWithResponseForDevice(deviceID, serviceID, passCharacteristicID, encodedPassword)
        console.log('Password sent');
        // setTimeout(() => startMonitoring(), 200);
    }
        

    // nasłuchiwanie na zmiany w charakterystyce? do dekodowania wiadomości z płytki? 
    // function startMonitoring() {
    //     manager.monitorCharacteristicForDevice(deviceID, serviceID, characteristicID, (err, rxSerial) => {
    //       if (err) {
    //         console.log(err);
    //       } else {
    //         const decodedCommad = base64.decode(rxSerial.value);
    //         setReceiveCommand(decodedCommad);
    //       }
    //     }, 'LISTEN');
    //   }

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



    // useEffect(() => {
    //     console.log('Device list: ' + JSON.stringify(deviceList));
    // }, [deviceList]);


    return (
        <View style={styles.container}>
            <Text style={styles.h2}>Connect new device</Text>
            {
                isScanning ? <Text style={globalStyles.text}>Scanning...</Text> : <Text style={globalStyles.text}>Not scanning</Text>
            }
            {
                (isConnected & deviceID) ? <Text style={globalStyles.text}>Connected to {deviceID}</Text> : <Text style={globalStyles.text}>Not connected</Text>
            }
            {
                !!deviceList.length != 0 && deviceList.map((device, index) => {
                    return(
                        <View key={index} style={styles.deviceContainer}>
                            <View style={styles.deviceInfo}>
                                <Text style={styles.title}>{device.name}</Text>
                                <Text style={styles.info}>ID: {device.id}</Text>
                            </View>
                            <PrimaryButton text='Connect' onPress={() => connect(device)} mode='light'/>
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
            <PrimaryButton text='Send SSID' onPress={sendSSID} />
            <PrimaryButton text='Send password' onPress={sendPassword} />

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