import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";
import { modalStyles } from "../Maps/Gym/SectionModal";
import Colors from "../../constants/Colors";
import { ToastProps } from "../Reusables/Toast";
import fetchImageFromFirebase from "../../firebase/images";
import { SectionDetails } from "../Favorites/useFavorites";

interface MapIconWithModalProps {
  section: SectionDetails;
  setToast: (toast: ToastProps) => void;
  localNickname: string;
}

const MapIconWithModal: React.FC<MapIconWithModalProps> = ({
  section,
  setToast,
  localNickname,
}) => {
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
        setToast({ message: localNickname + " image not available", color: "red" });
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

  return (
    <>
      <MaterialIcons
        name="image"
        size={24}
        color={Colors.uiucOrange}
        style={modalStyles.mapIcon}
        onPress={handleMapIconClick}
      />
      <Modal
        visible={isImagePopupVisible}
        transparent={true}
        onRequestClose={closeImagePopup}
      >
        <View style={styles.fullScreenOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.imageHeader}>
              {`${section.gym.toUpperCase()}: ${section.name}`}
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
            <Text style={styles.imageFooter}>{section.level} Level</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
    maxWidth: "80%", // Adjust the percentage as needed
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
});

export default MapIconWithModal;