import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import InfoInstructions from '../Profile/InfoInstructions';

const InfoScreen = () => {
    return (
        <View style={styles.container}>
            <InfoInstructions />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnightBlue,
    padding: 15,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default InfoScreen;
