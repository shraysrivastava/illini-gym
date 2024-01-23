import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DocumentData } from "firebase/firestore";
import CustomText from "../../Reusables/CustomText";
import Colors from "../../../constants/Colors";
import { getTimeDifference } from "../../Reusables/Utilities";
import ProgressBar from "../../Reusables/ProgressBar";
import { ToastProps } from "../../Reusables/Toast";
import fetchImageFromFirebase from "../../../firebase/images";
import ImageViewer from "react-native-image-zoom-viewer";

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
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [isImagePopupVisible, setImagePopupVisible] = useState(false);

    const handleMapIconClick = async () => {
      try {
        const imagePath = `images/${section.gym}=${section.key}.png`;
        const url = await fetchImageFromFirebase(imagePath);
        if (url) {
          setImageURL(url);
          setImagePopupVisible(true);
        } else {
          setToast({ message: section.name +  " image not available", color: "red" });
        }
      } catch (error) {
        setToast({ message: "Error loading map", color: "red" });
      }
    };

    const closeImagePopup = () => {
      setImagePopupVisible(false);
    };

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
            color={isFavorite ? "gold" : "gray"}
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
          <MaterialIcons
            name="image"
            size={24}
            color="white"
            style={modalStyles.mapIcon}
            onPress={handleMapIconClick}
          />
        </View>

        <Modal
          visible={isImagePopupVisible}
          transparent={true}
          onRequestClose={closeImagePopup}
        >
          <View style={modalStyles.fullScreenOverlay}>
            <View style={modalStyles.modalContent}>
              <View style={modalStyles.modalHeader}>
                <Text style={modalStyles.imageHeader}>
                  {`${section.name}`}
                </Text>
                <TouchableOpacity
                  style={modalStyles.closeButton}
                  onPress={closeImagePopup}
                >
                  <MaterialIcons name="close" size={30} color="red" />
                </TouchableOpacity>
              </View>

              {imageURL && (
                <ImageViewer
                  imageUrls={[{ url: imageURL }]}
                  backgroundColor="transparent"
                  enableSwipeDown={true}
                  onSwipeDown={closeImagePopup}
                  style={modalStyles.imageViewerContainer}
                  renderIndicator={() => <></>}
                />
              )}
              <Text style={modalStyles.imageFooter}>{`${section.level}`} Level</Text>
            </View>
          </View>
        </Modal>
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
    fontSize: 15,
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
    marginLeft: 5,
    fontSize: 16,
    color: "#D9534F",
    alignSelf: "flex-start",
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  imageViewerContainer: {
    width: "100%",
    flex: 1,
  },
  modalContent: {
    width: "90%",
    height: "40%",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
  },
  modalHeader: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  imageHeader: {
    color: Colors.uiucOrange,
    fontSize: 18,
    fontWeight: "bold",
    maxWidth: "85%", // Adjust the percentage as needed
    textAlign: "center", // Align text in the center
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  imageFooter: {
    color: Colors.uiucOrange,
    fontSize: 20,
    fontWeight: "bold",
  },
  // ... other styles ...
});