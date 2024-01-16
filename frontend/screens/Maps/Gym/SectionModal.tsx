import React from "react";
import { View, Dimensions } from "react-native";
import * as Progress from "react-native-progress";
import { MaterialIcons } from "@expo/vector-icons";
import { DocumentData } from "firebase/firestore";
// import { dataStyles } from "../../Reusables/ModalStyles";
import CustomText from "../../Reusables/CustomText";
import { StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";
import { getTimeDifference } from "../../Reusables/Utilities";
import ProgressBar from "../../Reusables/ProgressBar";
import MapIconWithModalGym from "../../Reusables/DisplaySmallMapGym";
import { ToastProps } from "../../Reusables/Toast";

interface SectionProps {
  section: DocumentData;
  handleFavoritePress: (key: string, name: string) => void;
  isFavorite: boolean;
  setToast: (toast: ToastProps) => void;
}

interface SectionModalProps {
  sections: DocumentData[];
  pressedSections: Record<string, boolean>;
  handleFavoritePress: (key: string, name: string) => void;
  setToast: (toast: ToastProps) => void;
}

export const SectionModals: React.FC<SectionModalProps> = React.memo(
  ({ sections, pressedSections, handleFavoritePress, setToast }) => {
    return (
      <View style={modalStyles.listContainer}>
        {sections.map((section) => (
          <Section
            key={section.key}
            section={section}
            handleFavoritePress={handleFavoritePress}
            isFavorite={pressedSections[section.key]}
            setToast={setToast}
          />
        ))}
      </View>
    );
  }
);

export const VisibilityIcon: React.FC<{ isOpen: boolean }> = React.memo(
  ({ isOpen }) => {
    return isOpen ? (
      <MaterialIcons name="visibility" size={24} color="green" />
    ) : (
      <MaterialIcons name="visibility-off" size={24} color="red" />
    );
  }
);

export const SectionInfo: React.FC<{ section: DocumentData }> = ({
  section,
}) => {
  return section.isOpen ? (
    <ProgressBar count={section.count} capacity={section.capacity} />
  ) : (
    <CustomText style={modalStyles.closedText}>Section Closed</CustomText>
  );
};

const Section: React.FC<SectionProps> = React.memo(
  ({ section, handleFavoritePress, isFavorite, setToast }) => {
    const timeDiff = getTimeDifference(section.lastUpdated);
    return (
      <View style={modalStyles.individualSectionContainer}>
        {/* Top Row: Visibility Icon, Section Name, and Star Icon */}
        <View style={modalStyles.row}>
          <VisibilityIcon isOpen={section.isOpen} />
          <CustomText style={modalStyles.sectionName}>
            {section.name}
          </CustomText>
          <MaterialIcons
            name={isFavorite ? "star" : "star-outline"}
            size={28}
            color={isFavorite ? "green" : "gray"}
            style={modalStyles.starIcon}
            onPress={() => handleFavoritePress(section.key, section.name)}
          />
        </View>

        {/* Middle Row: Last Updated */}
        <CustomText style={modalStyles.lastUpdated}>
          Last Updated: {timeDiff}
        </CustomText>

        {/* Bottom Row: Either Progress Bar or 'Section Closed' Text */}
        <View style={modalStyles.row}>
        <SectionInfo section={section} />
        <MapIconWithModalGym
          section={section}
          setToast={setToast}
        />
      </View>
      </View>
    );
  }
);

export const modalStyles = StyleSheet.create({
  listContainer: {
    // width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding:2
  },
  individualSectionContainer: {
    width: "100%",
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.subtleWhite,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.subtleWhite,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  sectionName: {
    marginLeft: 5,
    fontSize: 20,
    fontWeight: "bold",
    flex: 1, // Ensures name takes up the available space
  },
  starIcon: {
    // Removed absolute positioning
  },
  lastUpdated: {
    fontSize: 16,
    color: "gray",
    alignSelf: "flex-start",
    marginVertical: 5,
    marginHorizontal: 5,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  countCapacityText: {
    fontSize: 15,
  },
  mapIcon: {
    // Adjust positioning if necessary
    right: 3,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "flex-start",
    marginHorizontal: 10,
  },
  progressPercentageContainer: {
    position: "absolute", // Position it over the progress bar
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercentageText: {
    color: "white", // Ensure the text is visible on the progress bar
  },
  closedText: {
    fontSize: 16,
    color: "#D9534F",
    alignSelf: "flex-start",
  },
  // ... other styles ...
});
