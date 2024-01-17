import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import CustomText from '../Reusables/CustomText';

const InfoScreen = () => {
    return (
        <View style={styles.container}>
            <CustomText style={styles.heading}>Data Source Information</CustomText>
            <CustomText style={styles.text}>
                Note: All data is collected by Campus Recreation staff and is updated every 20 minutes.
            </CustomText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.midnightBlue,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: Colors.uiucOrange,
    },
    text: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    sourceUrl: {
        fontSize: 18,
        color: Colors.uiucOrange,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
});

export default InfoScreen;