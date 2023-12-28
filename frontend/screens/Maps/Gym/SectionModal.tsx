import React from "react";
import { View } from "react-native";
import * as Progress from "react-native-progress";
import { MaterialIcons } from "@expo/vector-icons";
import { DocumentData } from "firebase/firestore";
// import { dataStyles } from "../../Reusables/ModalStyles";
import CustomText from "../../Reusables/CustomText";
import { StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";

interface SectionProps {
  section: DocumentData;
  handleFavoritePress: (key: string, name: string) => void;
  isFavorite: boolean;
}

interface SectionModalProps {
  sections: DocumentData[];
  pressedSections: Record<string, boolean>;
  handleFavoritePress: (key: string, name: string) => void;
}

export const SectionModals: React.FC<SectionModalProps> = React.memo(
  ({ sections, pressedSections, handleFavoritePress }) => {
    return (
      <View style={styles.sectionContainer}>
        {sections.map((section) => (
          <Section
            key={section.key}
            section={section}
            handleFavoritePress={handleFavoritePress}
            isFavorite={pressedSections[section.key]}
          />
        ))}
      </View>
    );
  }
);

const Section: React.FC<SectionProps> = React.memo(
  ({ section, handleFavoritePress, isFavorite }) => {
    return (
      <View key={section.key} style={styles.gymContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.sectionHeader}>
            {section.isOpen ? (
              <MaterialIcons name="visibility" size={24} color="green" />
            ) : (
              <MaterialIcons name="visibility-off" size={24} color="red" />
            )}
            <CustomText style={styles.gymName}>{section.name}</CustomText>
          </View>
          <MaterialIcons
            name={isFavorite ? "star" : "star-outline"}
            size={24}
            color={isFavorite ? "green" : "gray"}
            style={styles.iconButton}
            onPress={() => handleFavoritePress(section.key, section.name)}
          />
        </View>
        <CustomText style={styles.lastUpdated}>
          Last Updated: {section.lastUpdated}
        </CustomText>
        {section.isOpen ? (
          <View style={styles.progressBarContainer}>
            <Progress.Bar
              progress={section.count / section.capacity}
              width={250 - 60}
              color={
                section.count / section.capacity <= 0.5
                  ? "#4CAF50"
                  : section.count / section.capacity < 0.8
                  ? "#FFE66D"
                  : "#FF6B6B"
              }
              unfilledColor="grey"
              style={{ marginRight: 10 }}
            />

            <CustomText style={styles.countCapacityText}>
              {section.count}/{section.capacity} People
            </CustomText>
          </View>
        ) : (
          <CustomText style={styles.unavailableText}>Section Closed</CustomText>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  gymContainer: {
    marginHorizontal: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Colors.subtleWhite,
    borderColor: Colors.subtleWhite,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "flex-start",
    marginHorizontal: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom:5
  },
  gymName: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {},
  sectionContainer: {
    width: "100%",
  },
  lastUpdated: {
    fontSize: 16,
    color: "gray",
    alignSelf: "flex-start",
    marginBottom: 5,
    marginHorizontal: 10,
  },
  countCapacityText: {
    fontSize: 15,
  },

  unavailableText: {
    fontSize: 16,
    color: '#D9534F',
    textAlign: 'center',
  },
});