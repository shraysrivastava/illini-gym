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
        <MaterialIcons
          name="map"
          size={40}
          color={Colors.white}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>Discover Gyms</CustomText>
          <CustomText style={styles.instructionText}>
            Click on the map icon in the bottom navigation to find gyms near
            you.
          </CustomText>
        </View>
      </View>

      {/* Using MaterialCommunityIcons for this item */}
      <View style={styles.instructionContainer}>
        <MaterialCommunityIcons
          name="map-marker-radius"
          size={40}
          color={"white"}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>
            Select Your Gym
          </CustomText>
          <CustomText style={styles.instructionText}>
            Select a gym marker and click on "Add to Favorites" to view its
            sections.
          </CustomText>
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <MaterialIcons name="star" size={40} color="white" style={styles.icon} />
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>
            Favorite Sections
          </CustomText>
          <CustomText style={styles.instructionText}>
            Click the star icon to add a section to your Favorites. Return to
            the favorites screen to view your newly added favorited sections.
          </CustomText>
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <MaterialIcons
          name="edit"
          size={40}
          color={"white"}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>
            Edit Favorites
          </CustomText>
          <CustomText style={styles.instructionText}>
            After adding favorites, you can rename and reorder them using the
            pencil icon in the header.
          </CustomText>
        </View>
      </View>
      <View style={styles.instructionContainer}>
        <MaterialIcons
          name="image"
          size={40}
          color={"white"}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>
            View Section Details
          </CustomText>
          <CustomText style={styles.instructionText}>
            Click on the image icon to toggle between the section location and an image of the section.
          </CustomText>
        </View>
      </View>

      {/* ... other items ... */}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: Colors.midnightBlue, // Assuming this is your dark blue color
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.subtleWhite, // Slightly lighter than the background
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 18,
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
