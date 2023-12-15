import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Example icon library
import CustomText from "../Reusables/CustomText";

const FavoriteInstructions = () => {
  return (
    <View style={styles.container}>
      <CustomText style={styles.headerText}>Add to Your Favorites</CustomText>

      <View style={styles.instructionContainer}>
        <FontAwesome name="map-o" size={24} color="white" />
        <CustomText style={styles.instructionText}>
          Navigate to the maps icon at the bottom navigation bar.
        </CustomText>
      </View>

      <View style={styles.instructionContainer}>
        <FontAwesome name="check-square-o" size={24} color="white" />
        <CustomText style={styles.instructionText}>
          Select the gym appropriate for you.
        </CustomText>
      </View>

      <View style={styles.instructionContainer}>
        <FontAwesome name="star-o" size={24} color="white" />
        <CustomText style={styles.instructionText}>
          Next to each room list, select the star for those you want on your
          favorites tab.
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default FavoriteInstructions;
