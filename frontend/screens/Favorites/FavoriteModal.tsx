// FavoriteModal.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomText from "../Reusables/CustomText";
import { getTimeDifference } from "../Reusables/Utilities";
import Colors from "../../constants/Colors";
import { SectionDetails } from "./FavoritesScreen";
import {
  SectionInfo,
  VisibilityIcon,
  modalStyles,
} from "../Maps/Gym/SectionModal";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Linking } from "react-native";
import  fetchImageFromFirebase  from  "../../firebase/images";

interface FavoriteModalProps {
  section: SectionDetails;
  gym: string;
  id: string;
  isEditMode: boolean;
  editableNicknames: { [key: string]: string };
  sectionNicknames: { [key: string]: string };
  handleRemoveFavorite: (
    gym: string,
    sectionKey: string,
    sectionName: string
  ) => void;
  updateNickname: (id: string, newNickname: string) => void;
}


const FavoriteModal: React.FC<FavoriteModalProps> = ({
  section,
  gym,
  id,
  isEditMode,
  sectionNicknames,
  editableNicknames,
  handleRemoveFavorite,
  updateNickname,
}) => {
  const timeDiff = getTimeDifference(section.lastUpdated);
  const initialNickname =
    editableNicknames[id] ?? sectionNicknames[id] ?? section.name;
  const [localNickname, setLocalNickname] = useState(initialNickname);

  const resetNickname = () => {
    setLocalNickname(section.name);
    updateNickname(id, section.name);
  };

  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isImagePopupVisible, setImagePopupVisible] = useState(false);

  const handleMapIconClick = async () => {
    const url = await fetchImageFromFirebase('test-images/arc-baseimage-1.png');
    setImageURL(url);
    setImagePopupVisible(true); // Show the popup when the image is fetched
  };

  // Function to close the image popup
  const closeImagePopup = () => {
    setImagePopupVisible(false);
  };
  
  return (
    <View style={modalStyles.individualSectionContainer}>
      {isEditMode ? (
        // Edit Mode UI
        <View style={modalStyles.row}>
          <MaterialIcons
            name="edit"
            size={20}
            color={Colors.uiucOrange}
            style={{ marginLeft: 5 }}
          />
          <TextInput
            style={styles.editName}
            value={localNickname}
            onChangeText={setLocalNickname}
            onEndEditing={() => updateNickname(id, localNickname)}
            placeholder="Enter Name"
            placeholderTextColor="gray"
            maxLength={27}
          />
          <MaterialCommunityIcons
            name="restart"
            size={28}
            color={Colors.uiucOrange}
            onPress={resetNickname}
          />
        </View>
      ) : (
        // Regular Display UI
        <View style={modalStyles.row}>
          <VisibilityIcon isOpen={section.isOpen} />
          <CustomText style={modalStyles.sectionName}>
            {localNickname}
          </CustomText>
          <MaterialIcons
            name="remove-circle-outline"
            size={28}
            color="red"
            onPress={() => handleRemoveFavorite(gym, section.key, section.name)}
          />
        </View>
      )}

      <CustomText style={modalStyles.lastUpdated}>
        Last Updated: {timeDiff}
      </CustomText>
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
        <TouchableOpacity
          style={styles.popupOverlay}
          activeOpacity={1}
          onPress={closeImagePopup}
        >
          <View style={styles.popupContainer}>
            {imageURL && (
              <Image
                source={{ uri: imageURL }}
                style={styles.popupImage}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  editName: {
    color: "white",
    marginLeft: 5,
    fontSize: 20,
    fontWeight: "bold",
    flex: 1, // Ensures name takes up the available space
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupImage: {
    width: 300, // or your desired width
    height: 300, // or your desired height
  },
});

export default React.memo(FavoriteModal);
