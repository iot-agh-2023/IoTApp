import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device, enableBluetooth } from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

function useBLE() {
    const bleManager = useMemo(() => new BleManager(), []);

    const [allDevices, setAllDevices] = useState([]);
    // const [connectedDevice, setConnectedDevice] = useState(null);

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
        // BleManager.enableBluetooth().then(() => {
        //     console.log('Bluetooth is turned on!');
        //   }, () => requestPermissions());

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

    const isDuplicateDevice = (devices, nextDevice) => 
        devices?.findIndex(device => device.id === nextDevice.id) > -1;

    const scanForPeripherals = async () => {
        bleManager.startDeviceScan(null, null, (error, device) => {
            if(error){
                console.log(error);
                return;
            }

            // tu sprawdzamy czy to jest nasze urządzenie
            if(device && device.name?.includes("OPPO")){
                setAllDevices(prevDevices => {
                    if(!isDuplicateDevice(prevDevices, device)){
                        return [...prevDevices, device];
                    }
                    return prevDevices;
                });
            }
        });
    }

    const connectToDevice = async (device) => {
        try{
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
        } catch(error){
            console.log(error);
        }
    }

    return{
        scanForPeripherals,
        requestPermissions,
        allDevices,
        // connectedDevice,
        // connectToDevice,
    };
}

export default useBLE;