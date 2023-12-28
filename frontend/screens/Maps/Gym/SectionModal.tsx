import React from "react";
import { View, Dimensions } from "react-native";
import * as Progress from "react-native-progress";
import { MaterialIcons } from "@expo/vector-icons";
import { DocumentData } from "firebase/firestore";
// import { dataStyles } from "../../Reusables/ModalStyles";
import CustomText from "../../Reusables/CustomText";
import { StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";
import { getTimeDifference } from "../../Reusables/Calculations";
import ProgressBar from "../../Reusables/ProgressBar";

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
      <View style={styles.listContainer}>
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

const VisibilityIcon: React.FC<{ isOpen: boolean }> = React.memo(({ isOpen }) => {
  return isOpen ? (
    <MaterialIcons name="visibility" size={24} color="green" />
  ) : (
    <MaterialIcons name="visibility-off" size={24} color="red" />
  );
});

export const SectionInfo: React.FC<{section: DocumentData}> = ({ section }) => {
  

  return (
    section.isOpen ? (
      <ProgressBar  count={section.count} capacity={section.capacity} />
    ) : (
      <CustomText style={styles.closedText}>Section Closed</CustomText>
    )
  );
};

const Section: React.FC<SectionProps> = React.memo(({ section, handleFavoritePress, isFavorite }) => {
  const timeDiff = getTimeDifference(section.lastUpdated);
  return (
    <View style={styles.individualSectionContainer}>
      {/* Top Row: Visibility Icon, Section Name, and Star Icon */}
      <View style={styles.row}>
        <VisibilityIcon isOpen={section.isOpen} />
        <CustomText style={styles.sectionName}>{section.name}</CustomText>
        <MaterialIcons
          name={isFavorite ? "star" : "star-outline"}
          size={32}
          color={isFavorite ? "green" : "gray"}
          style={styles.starIcon}
          onPress={() => handleFavoritePress(section.key, section.name)}
        />
      </View>

      {/* Middle Row: Last Updated */}
      <CustomText style={styles.lastUpdated}>As of {timeDiff}</CustomText>
      
      {/* Bottom Row: Either Progress Bar or 'Section Closed' Text */}
      <View style={styles.row}>
        <SectionInfo section={section} />
        <MaterialIcons name="map" size={24} color="white" style={styles.mapIcon} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  listContainer: {
    // width: "100%",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  individualSectionContainer: {
    width: "100%",
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal:10,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: Colors.subtleWhite,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.subtleWhite,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sectionName: {
    marginLeft: 5,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1, // Ensures name takes up the available space
  },
  starIcon: {
    // Removed absolute positioning
  },
  lastUpdated: {
    fontSize: 16,
    color: 'gray',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginHorizontal: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  countCapacityText: {
    fontSize: 15,
  },
  mapIcon: {
    // Adjust positioning if necessary
    right:3
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "flex-start",
    marginHorizontal: 10,
  },
  progressPercentageContainer: {
    position: 'absolute', // Position it over the progress bar
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentageText: {
    color: 'white', // Ensure the text is visible on the progress bar
  },
  closedText: {
    fontSize: 16,
    color: '#D9534F',
    alignSelf: 'flex-start',
  },
  // ... other styles ...
});