import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
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
const Maps = {
  "arc=gym-1.png": require("../../assets/maps/arc=gym-1.png"),
  "arc=gym-2.png": require("../../assets/maps/arc=gym-2.png"),
  "arc=gym-3.png": require("../../assets/maps/arc=gym-3.png"),
  "arc=combat-room.png": require("../../assets/maps/arc=combat-room.png"),
  "arc=entrance-level-fitness-area.png": require("../../assets/maps/arc=entrance-level-fitness-area.png"),
  "arc=indoor-pool.png": require("../../assets/maps/arc=indoor-pool.png"),
  "arc=lower-level.png": require("../../assets/maps/arc=lower-level.png"),
  "arc=mp-room-1.png": require("../../assets/maps/arc=mp-room-1.png"),
  "arc=mp-room-2.png": require("../../assets/maps/arc=mp-room-2.png"),
  "arc=mp-room-3.png": require("../../assets/maps/arc=mp-room-3.png"),
  "arc=mp-room-4.png": require("../../assets/maps/arc=mp-room-4.png"),
  "arc=mp-room-5.png": require("../../assets/maps/arc=mp-room-5.png"),
  "arc=mp-room-6.png": require("../../assets/maps/arc=mp-room-6.png"),
  "arc=mp-room-7.png": require("../../assets/maps/arc=mp-room-7.png"),
  "arc=olympic-pod.png": require("../../assets/maps/arc=olympic-pod.png"),
  "arc=raquetball-courts.png": require("../../assets/maps/arc=raquetball-courts.png"),
  "arc=rock-wall.png": require("../../assets/maps/arc=rock-wall.png"),
  "arc=squash-courts.png": require("../../assets/maps/arc=squash-courts.png"),
  "arc=upper-level.png": require("../../assets/maps/arc=upper-level.png"),
  "arc=strength-and-conditioning-zone.png": require("../../assets/maps/arc=strength-and-conditioning-zone.png"),
};

const MapIconWithModal: React.FC<MapIconWithModalProps> = ({
  section,
  setToast,
  localNickname,
}) => {
  const [imageURL, setImageURL] = useState<number | null>(null);
  const [isImagePopupVisible, setImagePopupVisible] = useState(false);

  const handleMapIconClick = async () => {
    try {
      const imagePath = `${section.gym}=${section.key}.png`;
      const url = Maps[imagePath];
      if (url) {
        setImageURL(url);
        setImagePopupVisible(true);
      } else {
        setToast({
          message: localNickname + " image not available",
          color: "red",
        });
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
                imageUrls={[
                  { url: Image.resolveAssetSource(imageURL).uri },
                ]}
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
