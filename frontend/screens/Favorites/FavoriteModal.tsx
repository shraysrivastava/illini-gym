// FavoriteModal.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
  handleRemoveFavorite: (gym: string, sectionKey: string, sectionName: string) => void;
  updateNickname: (id: string, newNickname: string) => void;
}

const FavoriteModal: React.FC<FavoriteModalProps> = ({ section, gym, id, isEditMode, editableNicknames, handleRemoveFavorite, updateNickname }) => {
  const timeDiff = getTimeDifference(section.lastUpdated);
  const [localNickname, setLocalNickname] = useState(editableNicknames[id] || section.name);

  const handleEndEditing = () => {
    updateNickname(id, localNickname);
  };
  return (
    
    <View style={modalStyles.individualSectionContainer}>
      {/* Top Row: Visibility Icon, Section Name, and Star Icon */}
      <View style={modalStyles.row}>
        
        <VisibilityIcon isOpen={section.isOpen} />
        {isEditMode ? (
          <TextInput
            style={styles.editName}
            value={localNickname}
            onChangeText={setLocalNickname}
            onEndEditing={handleEndEditing}
            placeholder={isEditMode && !localNickname ? "Enter Nickname" : ""}
            placeholderTextColor={"gray"}
            maxLength={20}
          />
        ) : (
          <CustomText style={modalStyles.sectionName}>
            {editableNicknames[id] || section.name}
          </CustomText>
        )}
        <MaterialIcons
          name="remove-circle-outline"
          size={24}
          color="red"
          onPress={() => handleRemoveFavorite(gym, section.key, section.name)}
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
              name="map"
              size={24}
              color="white"
              style={modalStyles.mapIcon}
            />
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
      },
});


export default React.memo(FavoriteModal);
