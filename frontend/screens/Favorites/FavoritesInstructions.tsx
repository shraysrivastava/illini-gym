import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import CustomText from "../Reusables/CustomText";
import Colors from "../../constants/Colors";

interface InstructionItemProps {
  icon?: keyof typeof FontAwesome.glyphMap;
  title?: string;
  text: string;
}

const FavoriteInstructions: React.FC = () => {
  return (
    <Animated.ScrollView style={styles.container}>
      <View style={styles.instructionContainer}>
        <MaterialIcons
          name="map"
          size={40}
          color={Colors.gray}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>Discover Gyms</CustomText>
          <CustomText style={styles.instructionText}>
            Explore the map to find gyms near you.
          </CustomText>
        </View>
      </View>

      {/* Using MaterialCommunityIcons for this item */}
      <View style={styles.instructionContainer}>
        <MaterialCommunityIcons
          name="map-marker-radius"
          size={40}
          color={Colors.uiucOrange}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>
            Select Your Gym
          </CustomText>
          <CustomText style={styles.instructionText}>
            Choose a gym and click on "Section Data" to view its sections.
          </CustomText>
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <MaterialIcons name="star" size={40} color="gold" style={styles.icon} />
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
        <MaterialIcons
          name="edit"
          size={40}
          color={Colors.uiucOrange}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <CustomText style={styles.instructionTitle}>
            Edit Favorites
          </CustomText>
          <CustomText style={styles.instructionText}>
            After adding favorites, you can rename and reorder them using the
            edit icon.
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
    color: "white",
    marginBottom: 5,
  },
});

export default FavoriteInstructions;
