import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";
import { modalStyles } from "../Maps/Gym/SectionModal";
import Colors from "../../constants/Colors";
import { ToastProps } from "../Reusables/Toast";
import { SectionDetails } from "../Favorites/useFavorites";
import Feather from "react-native-vector-icons/Feather";

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
  "arc=power-pod.png": require("../../assets/maps/arc=power-pod.png"),
  "arc=hiit-pod.png": require("../../assets/maps/arc=hiit-pod.png"),
  "arc=raquetball-courts.png": require("../../assets/maps/arc=raquetball-courts.png"),
  "arc=rock-wall.png": require("../../assets/maps/arc=rock-wall.png"),
  "arc=squash-courts.png": require("../../assets/maps/arc=squash-courts.png"),
  "arc=upper-level.png": require("../../assets/maps/arc=upper-level.png"),
  "arc=strength-and-conditioning-zone.png": require("../../assets/maps/arc=strength-and-conditioning-zone.png"),
};

const Pics = {
  "arc=combat-room.png": require("../../assets/illini-dumbbell.png"),
  "arc=strength-and-conditioning-zone.png": require("../../assets/images/arc=strength-and-conditioning-zone.png"),
};

const MapIconWithModal: React.FC<MapIconWithModalProps> = ({
  section,
  setToast,
  localNickname,
}) => {
  const [imageURL, setImageURL] = useState<number | null>(null);
  const [isImagePopupVisible, setImagePopupVisible] = useState(false);
  const [isMapView, setIsMapView] = useState(true);
  const [canToggle, setCanToggle] = useState(true); // New state variable


  const toggleView = () => {
    if (canToggle) {
      setIsMapView(!isMapView);
      setCanToggle(false); // Disable toggling
      setTimeout(() => {
        setCanToggle(true); // Enable toggling after 1 second
      }, 1000);
    }
  };
  useEffect(() => {
    const imagePath = `${section.gym}=${section.key}.png`;
    const url = isMapView ? Maps[imagePath] : Pics[imagePath];
    setImageURL(url);
  }, [isMapView, section.gym, section.key]);

  const handleMapIconClick = () => {
    if (imageURL) {
      setImagePopupVisible(true);
    } else {
      setToast({
        message: localNickname + " image not available",
        color: "red",
      });
    }
  };

  const closeImagePopup = () => {
    setImagePopupVisible(false);
    setIsMapView(true); 
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
              <View style={styles.toggleButtonContainer}>
                <TouchableOpacity
                  onPress={toggleView}
                  style={styles.toggleButton}
                >
                  {isMapView ? (
                    <Feather name="toggle-left" size={30} color={Colors.uiucOrange} />
                  ) : (
                    <Feather name="toggle-right" size={30} color={Colors.uiucOrange}/>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.imageHeader}>{section.level} Level</Text>
              </View>

              <View style={styles.closeButtonContainer}>
                <TouchableOpacity
                  onPress={closeImagePopup}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={30} color={Colors.midnightBlue} />
                </TouchableOpacity>
              </View>
            </View>
            {imageURL && (
              <ImageViewer
                imageUrls={[{ url: Image.resolveAssetSource(imageURL).uri }]}
                backgroundColor="transparent"
                enableSwipeDown={true}
                onSwipeDown={closeImagePopup}
                style={styles.imageViewerContainer}
                renderIndicator={() => <></>}
              />
            )}
            <Text style={styles.imageFooter}>
              {`${section.gym.toUpperCase()}: ${section.name}`}
            </Text>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%", // Ensure full width
    paddingHorizontal: 10,
  },
  toggleButtonContainer: {
    flex: 1,
    justifyContent: "flex-start", // Align toggle button to the start
  },
  toggleButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    color: "white", // Text color contrasting the button color
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  titleContainer: {
    flex: 2, // Give more space for the title to ensure it stays centered
    alignItems: "center", // Center the title
  },
  imageHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.midnightBlue,
  },
  closeButtonContainer: {
    flex: 1,
    alignItems: "flex-end", // Align close button to the end
  },
  closeButton: {
    position: "relative",
    zIndex: 1,
  },
  imageFooter: {
    color: Colors.uiucOrange,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default MapIconWithModal;

