import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton.js';
import { globalStyles } from '../utils.js';
import { TextInput } from 'react-native-gesture-handler';

export default function ConnectUser({ navigation, route }) {
    const [user, setUser] = useState();

    useEffect(() => {
      setUser(route.params);
    }, [route.params])

    const handelAdding = () => {
        console.log('adding user');
    }

    return (
        <View style={styles.container}>
            <Text style={globalStyles.h2}>Add user to your accout</Text>
            <TextInput style={globalStyles.input} placeholder='user email' />
            <PrimaryButton text='Add user' onPress={() => handelAdding()} />
            <Text style={globalStyles.text}>This user will be able to read measurements coming from your devices, but they won't be able to delete or modify them.</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
  });