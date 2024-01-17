import { View, StyleSheet } from 'react-native';


export function Divider() {
    return (
        <View style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginBottom: 10,
            marginTop: 10,
            width: '100%',}}
        />
    );
}
