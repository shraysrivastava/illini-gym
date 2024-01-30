import React, { useState, useEffect, memo } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";
import { modalStyles } from "../Maps/Gym/SectionModal";
import Colors from "../../constants/Colors";
import { ToastProps } from "../Reusables/Toast";
import { SectionDetails } from "../Favorites/useFavorites";
import Feather from "react-native-vector-icons/Feather";

interface MapIconWithModalProps {
  sectionKey: string;
  sectionGym: string;
  sectionLevel: string;
  sectionName: string;
  localNickname: string;
  setToast: (toast: ToastProps) => void;
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
  "arc=gym-1.png": require("../../assets/images/arc=gym-1.png"),
  "arc=gym-2.png": require("../../assets/images/arc=gym-2.png"),
  "arc=gym-3.png": require("../../assets/images/arc=gym-3.png"),
  "arc=combat-room.png": require("../../assets/images/arc=combat-room.png"),
  "arc=entrance-level-fitness-area.png": require("../../assets/images/arc=entrance-level-fitness-area.png"),
  "arc=indoor-pool.png": require("../../assets/images/arc=indoor-pool.png"),
  "arc=lower-level.png": require("../../assets/images/arc=lower-level.png"),
  "arc=mp-room-1.png": require("../../assets/images/arc=mp-room-1.png"),
  "arc=mp-room-2.png": require("../../assets/images/arc=mp-room-2.png"),
  "arc=mp-room-3.png": require("../../assets/images/arc=mp-room-3.png"),
  "arc=mp-room-4.png": require("../../assets/images/arc=mp-room-4.png"),
  "arc=mp-room-5.png": require("../../assets/images/arc=mp-room-5.png"),
  "arc=mp-room-6.png": require("../../assets/images/arc=mp-room-6.png"),
  "arc=mp-room-7.png": require("../../assets/images/arc=mp-room-7.png"),
  "arc=olympic-pod.png": require("../../assets/images/arc=olympic-pod.png"),
  "arc=power-pod.png": require("../../assets/images/arc=power-pod.png"),
  "arc=hiit-pod.png": require("../../assets/images/arc=hiit-pod.png"),
  "arc=raquetball-courts.png": require("../../assets/images/arc=raquetball-courts.png"),
  "arc=rock-wall.png": require("../../assets/images/arc=rock-wall.png"),
  "arc=squash-courts.png": require("../../assets/images/arc=squash-courts.png"),
  "arc=upper-level.png": require("../../assets/images/arc=upper-level.png"),
  "arc=strength-and-conditioning-zone.png": require("../../assets/images/arc=strength-and-conditioning-zone.png"),
};

interface ImageViewerMemoProps {
  imageURL: number | null;
  onLoad: () => void;
  isMapView: boolean;
}

const ImageViewerMemo = memo<ImageViewerMemoProps>(
  ({ imageURL, onLoad, isMapView }) => {
    if (!imageURL) {
      return null;
    }
    return (
      <>
      {isMapView ? (
        <Image
          source={imageURL}
          style={styles.mapViewerContainer}
          onLoad={onLoad}
        />
      ) : (
        <Image
          source={imageURL}
          style={styles.imageViewerContainer}
          onLoad={onLoad}
        />
    )}
        
        </>
    );
  },
  areEqual
);

function areEqual(
  prevProps: ImageViewerMemoProps,
  nextProps: ImageViewerMemoProps
) {
  // Customize the comparison to check if props are equal
  return prevProps.imageURL === nextProps.imageURL;
}

const MapIconWithModal: React.FC<MapIconWithModalProps> = ({
  sectionLevel,
  sectionName,
  sectionGym,
  sectionKey,
  setToast,
  localNickname,
}) => {
  const [imageURL, setImageURL] = useState<number | null>(null);
  const [isImagePopupVisible, setImagePopupVisible] = useState(false);
  const [isMapView, setIsMapView] = useState(false);
  const [canToggle, setCanToggle] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);

  const toggleView = () => {
    if (canToggle) {
      setIsImageLoading(true); // Start loading
      setShowImage(false); // Hide current image immediately
      setCanToggle(false);
      setTimeout(() => {
        // Toggle the view after a delay
        setIsMapView(!isMapView);
        setCanToggle(true);
      }, 500);
    }
  };



  useEffect(() => {
    const imagePath = `${sectionGym}=${sectionKey}.png`;
    const url = isMapView ? Maps[imagePath] : Pics[imagePath];
    setImageURL(url);
    if (imageURL) {
      setShowImage(false); // Hide image when URL changes
      setIsImageLoading(true); // Start loading new image
      // Simulate a delay for image loading (adjust this as needed)
      setTimeout(() => {
        setShowImage(true); // Show image after loading
        setIsImageLoading(false); // Stop loading
      }, 1000);
    }
  }, [imageURL, isMapView, sectionGym, sectionKey]);

  const handleMapIconClick = () => {
    if (imageURL) {
      setImagePopupVisible(true);
      setIsImageLoading(true);
    } else {
      setToast({
        message: localNickname + " image not available",
        color: "red",
      });
    }
  };

  const closeImagePopup = () => {
    setImagePopupVisible(false);
    setIsMapView(false);
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
              
                <TouchableOpacity
                  onPress={toggleView}
                  style={styles.toggleButton}
                >
                  {isMapView ? (
                    <Feather
                      name="toggle-right"
                      size={34}
                      color={Colors.uiucOrange}
                    />
                  ) : (
                    <Feather
                      name="toggle-left"
                      size={34}
                      color={Colors.uiucOrange}
                    />
                  )}
                </TouchableOpacity>
              
              
                <Text style={styles.imageHeader}>{sectionLevel} Level</Text>
              
              
                <TouchableOpacity
                  onPress={closeImagePopup}
                  style={styles.closeButton}
                >
                  <MaterialIcons
                    name="close"
                    size={34}
                    color={Colors.uiucOrange}
                  />
                </TouchableOpacity>
              
            </View>
            {isImageLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.uiucOrange} />
              </View>
            )}
            {showImage && (
              <ImageViewerMemo
                imageURL={imageURL}
                onLoad={() => setIsImageLoading(false)}
                isMapView={isMapView}
              />
            )}
            
            
              {/* <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.uiucOrange} />
              </View> */}
            <Text style={styles.imageFooter}>
              {`${sectionGym.toUpperCase()}: ${sectionName}`}
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
    
    flex: 1,
    width: "100%",
    height: "100%",
  },
  mapViewerContainer: {
    
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",

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
    marginBottom: 10,
  },
  toggleButtonContainer: {
    flex: 1,
    justifyContent: "flex-start", // Align toggle button to the start
  },
  toggleButton: {
    justifyContent: "center",
    alignItems: "center",
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
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.uiucBlue,
    textAlign: 'center',
  },
  closeButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  closeButton: {
    position: "relative",
    zIndex: 1,
  },
  imageFooter: {
    color: Colors.uiucBlue,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    

  },
  footer : {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10
  }
});

export default MapIconWithModal;
