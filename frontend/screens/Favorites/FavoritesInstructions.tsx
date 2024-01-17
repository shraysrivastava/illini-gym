import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Example icon library
import CustomText from "../Reusables/CustomText";
import { DocumentData } from "firebase/firestore";
import { SectionModals } from "../Maps/Gym/SectionModal";
import Colors from "../../constants/Colors";
const demoSections: DocumentData[] = [
  {
    key: "demo1",
    name: "Demo Section 1",
    isOpen: true,
    count: 17,
    capacity: 20,
    lastUpdated: "12/13/2023 11:41:04 AM",
  },
  {
    key: "demo2",
    name: "Demo Section 2",
    isOpen: true,
    count: 9,
    capacity: 20,
    lastUpdated: "12/13/2023 11:41:04 AM",
  },
];

const FavoriteInstructions = () => {
  return (
    <View>
      <View style={styles.container}>
        <CustomText style={styles.headerText}>Add to Your Favorites</CustomText>

        <View style={styles.instructionContainer}>
        <FontAwesome name="map-o" size={40} color="white" style={styles.icon} />
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>Discover Gyms</CustomText>
          <CustomText style={styles.instructionText}>
            Explore the map to find gyms near you.
          </CustomText>
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <FontAwesome name="check-square-o" size={40} color="white" style={styles.icon} />
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>Select Your Gym</CustomText>
          <CustomText style={styles.instructionText}>
            Choose a gym that fits your workout needs.
          </CustomText>
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <FontAwesome name="star-o" size={40} color="white" style={styles.icon} />
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>Favorite Rooms</CustomText>
          <CustomText style={styles.instructionText}>
            Star your preferred gym rooms for quick access.
          </CustomText>
        </View>
      </View>
      </View>

      <SectionModals
        sections={demoSections}
        pressedSections={{}}
        handleFavoritePress={() => {}}
        setToast={() => {}} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.uiucOrange,
    textAlign: "center",
    marginBottom: 30,
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
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  }
  
});

export default FavoriteInstructions;
