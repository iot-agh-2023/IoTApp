import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, TextInput } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import * as ExpoDevice from "expo-device";
import base64 from 'react-native-base64';

import { PrimaryButton } from '../components/PrimaryButton.js';
import { COLORS, globalStyles } from '../utils.js';
import { Divider } from '../components/Divider.js';

const manager = new BleManager();
const SERVICE_UUID = 'be39';
const SSID_CHARACTERISTIC_UUID = '1890';
const PASSWORD_CHARACTERISTIC_UUID = '33f0';

export default function ConnectDevice({ navigation, route }) {
    const [userID, setUserID] = useState('');
    const [ssid, setSSID] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setUserID(route.params.userID);
    }, [route.params]);

    useEffect(() => {
        confirmData();
    }, [ssid, password]);

    const confirmData = () => {
        if (ssid.length != '' && password != '') {
            setIsModelVisible(true);
        }
        else {
            setIsModelVisible(false);
        }
    }

    const [isModelVisible, setIsModelVisible] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    
    const [deviceList, setDeviceList] = useState([]);
    const [deviceID, setDeviceID] = useState('');
    const [deviceName, setDeviceName] = useState('');

    const onConnectHandler = async () => {
        if (isConnected){
            try{
                const response = await axios.post(
                    `${SERVER_PATH}/sensors`,
                    {
                        name: deviceName, 
                        sensorID: deviceID,
                        userID: userID,
                    }
                );
                alert("Device has been added to your account!")
                setDeviceList([])
            }catch{
                console.log("Error while adding sensor to user account");
            }
        } else {
            alert("Device is not connected and cannot be added to your account");
        }
    }

    // SCAN----------------------------------------------------------------------------------------------------------------

    const startScan = async () => {
        setIsScanning(true);
        let list = deviceList.slice();

        console.log('Scanning...');
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                setIsScanning(false);
                alert(error.message);
                console.log(error);
                return; 
            }
            const hasID = list.some(item => item.id === device.id);

            if (!hasID && device.name?.includes('GATT_DEVICE')) {
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
        .connect()
        .then(async connectedDevice => {
            setDeviceID(device.id)
            setDeviceName(device.name)
            console.log('Connected to ' + connectedDevice.id);
            setIsConnected(true);
            setTimeout(() => writeMessage(connectedDevice, SERVICE_UUID, SSID_CHARACTERISTIC_UUID, ssid), 1000 * 2)
            setTimeout(() => writeMessage(connectedDevice, SERVICE_UUID, PASSWORD_CHARACTERISTIC_UUID, password), 1000 * 2);
            onConnectHandler();
        })
        .catch(error => {
            alert("Make sure your device is turned on and in range of this device. Remember to turn on Bluetooth. Try again! ");
            console.log('Connection error 1:', error)
        })
    }


    // SEND----------------------------------------------------------------------------------------------------------------

    const writeMessage = async (device, _serviceUUID, _characteristicUUID,value) => {
        device.discoverAllServicesAndCharacteristics()
        .then(async (deviceWithServices) => {
            return await deviceWithServices.services()
        })
        .then(async (services) => {
            const serviceUUID = matchService(services, _serviceUUID)
            if (serviceUUID == null) {
                throw new Error("Service not found");
            }
            console.log("Service UUID: " + serviceUUID);
            return await device.characteristicsForService(serviceUUID)
        })
        .then((characteristics) => {

            device.writeCharacteristicWithoutResponseForService(_serviceUUID, _characteristicUUID, base64.encode(value))
            console.log('Message sent');
            return true;
        })
        .catch(error => {
            console.log('Write error 2: ', error)
        })
    }

    const matchService = (services, uuidPattern) => {
        var serviceUUID = null;
        console.log("szuakmy serviców")
        services.forEach(ser => {
            console.log(JSON.stringify(ser, null, 2))
            if (ser.uuid.includes(uuidPattern)) {   
                const customService = ser.uuid;
                serviceUUID = customService;
            }
        })
        return serviceUUID;
    }
        

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
            <Text style={globalStyles.h1}>Connect new device</Text>
            <Text style={globalStyles.h2}>Write SSID and Password to your Network</Text>
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

            <Divider />
            { isModelVisible ? (<View style={styles.container}>
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
                                    <PrimaryButton text='Connect' onPress={() => connect(device)} mode='light'/>
                                    {/* <PrimaryButton text='Disconnect' onPress={() => disconnectFromDevice()} mode='light'/> */}
                                </View>                           )
                        })
                    }
                    <PrimaryButton text='Scan' onPress={scan} />
                    <PrimaryButton text='Stop scan' onPress={stopScan} />
                </View>) : <Text>Fill in SSID and Password.</Text>
            }
            <StatusBar style="auto" />  
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: COLORS.white,
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
        borderColor: COLORS.black,
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
        paddingRight: 10,
        backgroundColor: COLORS.primary,
    },
    deviceInfo: {
        width: '50%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    title: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    info: {
        color: COLORS.white,
        fontSize: 12,
    }
  });