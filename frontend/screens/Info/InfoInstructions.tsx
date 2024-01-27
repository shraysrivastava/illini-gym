import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import CustomText from "../Reusables/CustomText";
import Colors from "../../constants/Colors";

const InfoInstructions: React.FC = () => {
  return (
    <Animated.ScrollView style={styles.container}>
      <View style={styles.instructionContainer}>
        
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>Discover Gyms</CustomText>
          <CustomText style={styles.instructionText}>
            Use the map icon to find nearby gyms.
          </CustomText>
        </View>
      </View>

      
      <View style={styles.instructionContainer}>
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>
            Select Your Gym
          </CustomText>
          <CustomText style={styles.instructionText}>
            Select a gym marker and click on "View Sections".
          </CustomText>
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>
            Favorite Sections
          </CustomText>
          <CustomText style={styles.instructionText}>
            Click the star icon to add a section to your favorites.
          </CustomText>
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>
            Edit Favorites
          </CustomText>
          <CustomText style={styles.instructionText}>
          Rename or reorder favorites via the pencil icon.
          </CustomText>
        </View>
      </View>
      <View style={styles.instructionContainer}>
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>
            Locate Section in Gym
          </CustomText>
          <CustomText style={styles.instructionText}>
            Tap the image icon to view a section's location.
          </CustomText>
        </View>
      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: Colors.midnightBlue, // Assuming this is your dark blue color
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: Colors.subtleWhite, // Slightly lighter than the background
    padding: 20,
    borderRadius: 8,
    marginTop: 0,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    // borderWidth: 1,
    // borderColor: Colors.uiucOrange,
  },
  instructionText: {
    fontSize: 20,
    color: "white", // Ensuring readability
    marginLeft: 10,
  },
  icon: {
    marginRight: 20, // For a pop of color
  },
  textContainer: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.uiucOrange,
    marginBottom: 5,
  },
});

export default InfoInstructions;
