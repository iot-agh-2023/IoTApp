import { StyleSheet } from 'react-native';

export const COLORS = {
    primary: '#14213D',
    secondary: '#FCA311',
    tertiary: '#E5E5E5',
    text: '#000',
    white: '#fff',
    black: '#000',
    gray: '#6A6A6A',
    gray2: '#EFEFEF',
}

export const globalStyles = StyleSheet.create({
    h1: {
        fontWeight: 'bold',
        fontSize: 25,
    },
    h2: {
        fontSize: 22,
        marginBottom: 20,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
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
    specialText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FCA311',
    },
});