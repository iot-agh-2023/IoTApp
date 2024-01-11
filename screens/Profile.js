import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton.js';
import { Divider } from '../components/Divider.js';
import { globalStyles } from '../utils.js';

export default function Profile({ navigation, route }) {
    const [user, setUser] = useState();

    useEffect(() => {
      setUser(route.params);
    }, [route.params])

    return (
        <View style={styles.container}>
            <Text style={globalStyles.h2}>Username: <Text style={globalStyles.text}>{ user && user.username }</Text></Text>
            <Text style={globalStyles.h2}>Email: <Text style={globalStyles.text}>{ user && user.email }</Text></Text>
            <Text style={globalStyles.h2}>UserID: <Text style={globalStyles.text}>{ user && user.userID }</Text></Text>

            <Divider />
            <PrimaryButton text='Logout' onPress={() => navigation.navigate('Login')} />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
  });