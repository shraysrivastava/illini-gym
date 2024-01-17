import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import CustomText from '../Reusables/CustomText';

const InfoScreen = () => {
    return (
        <View style={styles.container}>
            <CustomText style={styles.text}>Note: all data is sourced from https://apps2.campusrec.illinois.edu/checkins/live and is updated periodically. </CustomText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.midnightBlue,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default InfoScreen;
