// FavoriteModal.tsx
import React, { useState } from "react";
import {View, TextInput, TouchableOpacity, StyleSheet, Text, Modal,} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomText from "../Reusables/CustomText";
import { getTimeDifference } from "../Reusables/Utilities";
import Colors from "../../constants/Colors";
import { SectionDetails } from "./useFavorites";
import {SectionInfo, VisibilityIcon, modalStyles,} from "../Maps/Gym/SectionModal";
import fetchImageFromFirebase from "../../firebase/images";
import ImageViewer from "react-native-image-zoom-viewer";
import CustomToast, { ToastProps } from "../Reusables/Toast";

interface FavoriteModalProps {
  section: SectionDetails;
  fullID: string;
  isEditMode: boolean;
  isMarkedForDeletion: boolean;
  editableNicknames: { [key: string]: string };
  sectionNicknames: { [key: string]: string };
  handleToggleMarkForDeletion: (
    id: string,
    sectionName: string,
    mark: boolean
  ) => void;
  updateNickname: (id: string, newNickname: string) => void;
  handleReorder: (direction: "up" | "down", fullID: string) => void;
  setToast: (toast: ToastProps) => void;
}

const FavoriteModal: React.FC<FavoriteModalProps> = ({
  section,
  fullID,
  isEditMode,
  isMarkedForDeletion,
  sectionNicknames,
  editableNicknames,
  handleToggleMarkForDeletion,
  updateNickname,
  handleReorder,
  setToast,
}) => {
  const timeDiff = getTimeDifference(section.lastUpdated);
  const initialNickname =
    editableNicknames[fullID] ?? sectionNicknames[fullID] ?? section.name;
  const [localNickname, setLocalNickname] = useState(initialNickname);
  const itemStyle = isMarkedForDeletion ? styles.markedForDeletion : null;
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
        setToast({ message: "Image not found", color: "red" });
      }
    } catch (error) {
      setTimeout(
        () => setToast({ message: "Error loading map", color: "red" }),
        0
      );
    }
  };

  const closeImagePopup = () => {
    setImagePopupVisible(false);
  };

  const resetNickname = () => {
    setLocalNickname(section.name);
    updateNickname(fullID, section.name);
  };

  const EditModeHeader = () => (
    <View style={[modalStyles.row]}>
      <MaterialCommunityIcons
        name="restart"
        size={28}
        color={Colors.uiucOrange}
        onPress={resetNickname}
      />
      <TextInput
        style={styles.editName}
        value={localNickname}
        onChangeText={setLocalNickname}
        onEndEditing={() => updateNickname(fullID, localNickname)}
        placeholder="Enter Nickname"
        placeholderTextColor="gray"
        maxLength={27}
        editable={!isMarkedForDeletion}
      />
      <MaterialIcons
        name={
          isMarkedForDeletion ? "add-circle-outline" : "remove-circle-outline"
        }
        size={28}
        color={isMarkedForDeletion ? "green" : "red"}
        onPress={() =>
          handleToggleMarkForDeletion(
            fullID,
            localNickname,
            !isMarkedForDeletion
          )
        }
      />
    </View>
  );

  const RegularDisplayHeader = () => (
    <View style={modalStyles.row}>
      <VisibilityIcon isOpen={section.isOpen} />
      <CustomText style={modalStyles.sectionName}>{localNickname}</CustomText>
      <MaterialCommunityIcons
        name="dumbbell"
        size={28}
        color={Colors.uiucOrange}
      />
    </View>
  );

  const ReorderArrows = () => (
    <View style={styles.arrowsContainer}>
      <MaterialIcons
        name="keyboard-arrow-up"
        size={36}
        color="white"
        onPress={() => handleReorder("up", fullID)}
      />
      <MaterialIcons
        name="keyboard-arrow-down"
        size={36}
        color="white"
        onPress={() => handleReorder("down", fullID)}
      />
    </View>
  );

  return (
    <View style={[modalStyles.individualSectionContainer, itemStyle]}>
      {isEditMode ? <EditModeHeader /> : <RegularDisplayHeader />}

      {isEditMode ? (
        <ReorderArrows />
      ) : (
        <CustomText style={modalStyles.lastUpdated}>
          Last Updated: {timeDiff}
        </CustomText>
      )}

      <View style={modalStyles.row}>
        <SectionInfo section={section} />
        <MaterialIcons
          name="map"
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
        <View style={styles.fullScreenOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.imageHeader}>
                {`${section.gym}: ${section.key}`}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
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
                style={styles.imageViewerContainer}
                renderIndicator={() => <></>}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  markedForDeletion: {
    opacity: 0.5, // Or use any other visual representation
  },
  editName: {
    color: "white",
    marginLeft: 5,
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: Colors.uiucOrange, // Highlight color
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Subtle background
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4, // Optional: rounded corners
  },
  arrowsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 2,
  },
  arrowIcon: {
    color: "#007AFF", // Highlight color
    fontSize: 30,
    padding: 5, // Easier to tap
    borderRadius: 15, // Circular background
    backgroundColor: "rgba(0, 122, 255, 0.1)", // Subtle background color
    // Add shadow or other effects if needed
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
    alignSelf: "stretch", // Header takes full width
  },
  imageHeader: {
    color: Colors.uiucOrange,
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
});

export default React.memo(FavoriteModal);