// FavoriteModal.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableWithoutFeedback, StyleSheet, Keyboard } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, } from '@expo/vector-icons';
import CustomText from '../Reusables/CustomText';
import { getTimeDifference } from '../Reusables/Utilities';
import Colors from '../../constants/Colors';
import { SectionDetails } from './useFavorites';
import { SectionInfo, VisibilityIcon, modalStyles } from '../Maps/Gym/SectionModal';
import SpecialHours from '../Reusables/SpecialHours';


interface FavoriteModalProps {
  section: SectionDetails;
  fullID: string;
  isEditMode: boolean;
  isMarkedForDeletion: boolean;
  editableNicknames: { [key: string]: string };
  sectionNicknames: { [key: string]: string };
  handleToggleMarkForDeletion: (id: string, sectionName:string, mark: boolean) => void;
  updateNickname: (id: string, newNickname: string) => void;
  handleReorder: (direction: "up" | "down", fullID: string) => void;
}

const FavoriteModal: React.FC<FavoriteModalProps> = ({ section, fullID, isEditMode,isMarkedForDeletion, sectionNicknames, editableNicknames, handleToggleMarkForDeletion, updateNickname, handleReorder }) => {
  const timeDiff = getTimeDifference(section.lastUpdated);
  const initialNickname = editableNicknames[fullID] ?? sectionNicknames[fullID] ?? section.name;
  const [localNickname, setLocalNickname] = useState(initialNickname);
  const itemStyle = isMarkedForDeletion ? styles.markedForDeletion : null;
  
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
        name={isMarkedForDeletion ? "add-circle-outline" : "remove-circle-outline"}
        size={28}
        color={isMarkedForDeletion ? "green" : "red"}
        onPress={() => handleToggleMarkForDeletion(fullID, localNickname, !isMarkedForDeletion)}
      />
    </View>
  );

  const RegularDisplayHeader = () => (
    <View style={modalStyles.row}>
      <VisibilityIcon isOpen={section.isOpen} />
      <CustomText style={modalStyles.sectionName}>{localNickname}</CustomText>
      <MaterialCommunityIcons name="dumbbell" size={28} color={Colors.uiucOrange}/>
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
        />
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
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: Colors.uiucOrange, // Highlight color
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Subtle background
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4, // Optional: rounded corners
  },
      arrowsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', 
        marginVertical: 2
      },
      arrowIcon: {
        color: "#007AFF", // Highlight color
        fontSize: 30,
        padding: 5, // Easier to tap
        borderRadius: 15, // Circular background
        backgroundColor: "rgba(0, 122, 255, 0.1)", // Subtle background color
        // Add shadow or other effects if needed
      },
});


export default React.memo(FavoriteModal);