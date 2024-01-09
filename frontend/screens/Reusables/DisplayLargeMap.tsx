import React from 'react';
import CustomText from './CustomText';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const DisplayLargeMap: React.FC = () => {
    return (
        <View style={styles.container}>
            <CustomText>Insert large map here</CustomText>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.midnightBlue,
      }
});

export default DisplayLargeMap;
