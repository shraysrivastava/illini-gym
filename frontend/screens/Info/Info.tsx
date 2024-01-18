import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import CustomText from '../Reusables/CustomText';
import FavoriteInstructions from '../Favorites/FavoritesInstructions';

const InfoScreen = () => {
    return (
        <ScrollView style={styles.container}>
            {/* <CustomText style={styles.heading}>Using the App</CustomText> */}
            <CustomText style={styles.text}>
            Enhance your gym experience with these easy steps:            </CustomText>
            <FavoriteInstructions />
            <CustomText style={styles.disclaimer}>
                Note: Data is updated every 20 minutes by Campus Recreation staff. We strive for accuracy but are not responsible for any discrepancies.
            </CustomText>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.midnightBlue,
        padding: 15,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.uiucOrange,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.uiucOrange,
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 24, // Improves readability
    },
    disclaimer: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        fontStyle: 'italic',
    },
});

export default InfoScreen;
