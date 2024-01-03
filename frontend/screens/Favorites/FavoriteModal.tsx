// FavoriteModal.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomText from '../Reusables/CustomText';
import { getTimeDifference } from '../Reusables/Utilities';
import Colors from '../../constants/Colors';
import { SectionDetails } from './FavoritesScreen';
import { SectionInfo, VisibilityIcon, modalStyles } from '../Maps/Gym/SectionModal';


interface FavoriteModalProps {
  section: SectionDetails;
  gym: string;
  id: string;
  isEditMode: boolean;
  editableNicknames: { [key: string]: string };
  sectionNicknames: { [key: string]: string };
  handleRemoveFavorite: (gym: string, sectionKey: string, sectionName: string) => void;
  updateNickname: (id: string, newNickname: string) => void;
}

const FavoriteModal: React.FC<FavoriteModalProps> = ({ section, gym, id, isEditMode, sectionNicknames, editableNicknames, handleRemoveFavorite, updateNickname }) => {
  const timeDiff = getTimeDifference(section.lastUpdated);
  const initialNickname = editableNicknames[id] ?? sectionNicknames[id] ?? section.name;
  const [localNickname, setLocalNickname] = useState(initialNickname);
  
  const resetNickname = () => {
    setLocalNickname(section.name);
    updateNickname(id, section.name);
  };

  return (
    <View style={modalStyles.individualSectionContainer}>
      {isEditMode ? (
        // Edit Mode UI
        <View style={modalStyles.row}>
          <MaterialIcons name="edit" size={20} color={Colors.uiucOrange} style={{ marginLeft: 5 }} />
          <TextInput
            style={styles.editName}
            value={localNickname}
            onChangeText={setLocalNickname}
            onEndEditing={() => updateNickname(id, localNickname)}
            placeholder="Enter Name"
            placeholderTextColor="gray"
            maxLength={27}
          />
          <MaterialCommunityIcons name="restart" size={28} color={Colors.uiucOrange} onPress={resetNickname} />
        </View>
      ) : (
        // Regular Display UI
        <View style={modalStyles.row}>
          <VisibilityIcon isOpen={section.isOpen} />
          <CustomText style={modalStyles.sectionName}>{localNickname}</CustomText>
          <MaterialIcons
            name="remove-circle-outline"
            size={28}
            color="red"
            onPress={() => handleRemoveFavorite(gym, section.key, section.name)}
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
