// FavoriteModal.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomText from "../Reusables/CustomText";
import { getTimeDifference } from "../Reusables/Utilities";
import Colors from "../../constants/Colors";
import { SectionDetails } from "./useFavorites";
import {
  SectionInfo,
  VisibilityIcon,
  modalStyles,
} from "../Maps/Gym/SectionModal";
import { ToastProps } from "../Reusables/Toast";
import MapIconWithModal  from "../Reusables/DisplaySmallMap";

interface FavoriteModalProps {
  section: SectionDetails;
  fullID: string;
  isEditMode: boolean;
  isMarkedForDeletion: boolean;
  editableNicknames: { [key: string]: string };
  sectionNicknames: { [key: string]: string };
  handleToggleMarkForDeletion: (id: string, sectionName:string, mark: boolean) => void;
  updateNickname: (id: string, newNickname: string) => void;
  setToast: (toast: ToastProps) => void;
  moveSection: (id: string, direction: "up" | "down") => void;
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
  setToast,
  moveSection
}) => {
  const timeDiff = getTimeDifference(section.lastUpdated);
  const initialNickname =
    editableNicknames[fullID] ?? sectionNicknames[fullID] ?? section.name;
  const [localNickname, setLocalNickname] = useState(initialNickname);
  const itemStyle = isMarkedForDeletion ? styles.markedForDeletion : null;

  const resetNickname = () => {
    setLocalNickname(section.name);
    updateNickname(fullID, section.name);
  };

  return (
    <View style={[modalStyles.individualSectionContainer, itemStyle]}>
      {isEditMode ? (
        // Edit Mode UI
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
          {isMarkedForDeletion ? (
            <MaterialIcons
              name="add-circle-outline"
              size={28}
              color="green"
              opacity={1}
              onPress={() =>
                handleToggleMarkForDeletion(fullID, localNickname, false)
              }
            />
          ) : (
            <MaterialIcons
              name="remove-circle-outline"
              size={28}
              color="red"
              onPress={() =>
                handleToggleMarkForDeletion(fullID, localNickname, true)
              }
            />
          )}
        </View>
      ) : (
        // Regular Display UI
        <View style={modalStyles.row}>
          {/* <VisibilityIcon isOpen={section.isOpen} /> */}
          <CustomText style={modalStyles.sectionName}>
            {localNickname}
          </CustomText>
        </View>
      )}

      {isEditMode ? (
        <View style={modalStyles.row}>
          <MaterialIcons
            name="arrow-upward"
            style={styles.icon}
            size={32}
            color="white"
            onPress={() => moveSection(fullID, "up")}
          />
          <MaterialIcons
            name="arrow-downward"
            size={32}
            color="white"
            onPress={() => moveSection(fullID, "down")}
          />
        </View>
      ) : (
        <CustomText style={modalStyles.lastUpdated}>
          {timeDiff}
        </CustomText>
      )}

      
        <View style={modalStyles.row}>
          <SectionInfo section={section} />
          <MapIconWithModal sectionName={localNickname} setToast={setToast}  localNickname={localNickname}
          sectionGym={section.gym} sectionKey={section.key} sectionLevel={section.level}/>
        </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
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
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '90%', // or any other dimension
    height: '50%', // or any other dimension
    backgroundColor: 'transparent', // Optional: for additional styling
  },
  markedForDeletion: {
    opacity: 0.5, // Or use any other visual representation
  },
icon: {
  marginVertical: 5,
}
});

export default React.memo(FavoriteModal);