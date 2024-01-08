// FavoriteModal.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableWithoutFeedback, StyleSheet, Keyboard } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, } from '@expo/vector-icons';
import CustomText from '../Reusables/CustomText';
import { getTimeDifference } from '../Reusables/Utilities';
import Colors from '../../constants/Colors';
import { SectionDetails } from './useFavorites';
import { SectionInfo, VisibilityIcon, modalStyles } from '../Maps/Gym/SectionModal';


interface FavoriteModalProps {
  section: SectionDetails;
  gym: string;
  id: string;
  isEditMode: boolean;
  isMarkedForDeletion: boolean;
  editableNicknames: { [key: string]: string };
  sectionNicknames: { [key: string]: string };
  handleToggleMarkForDeletion: (id: string, sectionName:string, mark: boolean) => void;
  updateNickname: (id: string, newNickname: string) => void;
}

const FavoriteModal: React.FC<FavoriteModalProps> = ({ section, gym, id, isEditMode,isMarkedForDeletion, sectionNicknames, editableNicknames, handleToggleMarkForDeletion, updateNickname }) => {
  const timeDiff = getTimeDifference(section.lastUpdated);
  const initialNickname = editableNicknames[id] ?? sectionNicknames[id] ?? section.name;
  const [localNickname, setLocalNickname] = useState(initialNickname);
  const itemStyle = isMarkedForDeletion ? styles.markedForDeletion : null;

  
  const resetNickname = () => {
    setLocalNickname(section.name);
    updateNickname(id, section.name);
  };

  return (
    <View style={[modalStyles.individualSectionContainer, itemStyle]}>
      {isEditMode ? (
        // Edit Mode UI
        <View style={[modalStyles.row]}>
          <MaterialCommunityIcons name="restart" size={28} color={Colors.uiucOrange} onPress={resetNickname} />
          <TextInput
            style={styles.editName}
            value={localNickname}
            onChangeText={setLocalNickname}
            onEndEditing={() => updateNickname(id, localNickname)}
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
              onPress={() => handleToggleMarkForDeletion(id,localNickname, false)}
            />
          ) : (
            <MaterialIcons
              name="remove-circle-outline"
              size={28}
              color="red"
              onPress={() => handleToggleMarkForDeletion(id, localNickname, true)}
            />
          )}
        </View>
      ) : (
        // Regular Display UI
        <View style={modalStyles.row}>
          <VisibilityIcon isOpen={section.isOpen} />
          <CustomText style={modalStyles.sectionName}>{localNickname}</CustomText>
          <MaterialCommunityIcons
            name="dumbbell"
            size={28}
            color="white"
          />
        </View>
      )}

      <CustomText style={modalStyles.lastUpdated}>Last Updated: {timeDiff}</CustomText>
      <View style={modalStyles.row}>
        <SectionInfo section={section} />
        <MaterialIcons name="map" size={24} color="white" style={modalStyles.mapIcon} />
      </View>
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
        flex: 1, // Ensures name takes up the available space
        borderBottomWidth: 1,
        borderBottomColor: "white",
      },
});


export default React.memo(FavoriteModal);
