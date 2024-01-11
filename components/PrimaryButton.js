import { Text, Pressable, StyleSheet } from 'react-native';


export function PrimaryButton({ text, onPress, mode = 'dark' }) {
    return (
        mode === 'dark' ?
        <Pressable  style={styles.btn} onPress={onPress}>
            <Text style={styles.btnTitle} >{text}</Text>
        </Pressable> :
        <Pressable  style={styles.btnLight} onPress={onPress}>
            <Text style={styles.btnTitleLight} >{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btn: {
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#14213D',
    },
    btnTitle: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    btnLight: {
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    btnTitleLight: {
        color: '#14213D',
        fontSize: 16,
    }
});