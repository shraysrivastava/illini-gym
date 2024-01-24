import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Colors from "../../constants/Colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const FavoriteInstructions: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Welcome to Illini Gym</Text>
      <Text style={styles.subText}>Know Before You Go</Text>
      <Text style={styles.normalText}>📍 Find Gyms Nearby 📍</Text>
      <Text style={styles.normalText}>⭐ Add to Favorites ⭐</Text>
      <View style={styles.helpTextWrapper}>
        <MaterialIcons name="info-outline" size={24} color={Colors.uiucOrange} />
        <Text style={styles.helpText}> Need Help? Tap Info </Text>
        <MaterialIcons name="info-outline" size={24} color={Colors.uiucOrange} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 0,
    backgroundColor: Colors.midnightBlue,
  },
  mainText: {
    fontSize: 32,
    fontWeight: '600',
    color: "white",
    textAlign: 'center',
    marginBottom: 25,
  },
  subText: {
    fontSize: 18,
    color: Colors.uiucOrange,
    textAlign: 'center',
    marginBottom: 55,
    fontWeight: 'bold',
  },

  normalText: {
    fontSize: 20,
    color: "white",
    textAlign: 'center',
    marginBottom: 20,
  },
  helpTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  helpText: {
    fontSize: 20,
    color: "white",
    textAlign: 'center',
    lineHeight: 24, // Adjust line height to align with the icon size
    paddingHorizontal: 0, // Optional: Add some horizontal padding if needed
  },
});

export default FavoriteInstructions;
