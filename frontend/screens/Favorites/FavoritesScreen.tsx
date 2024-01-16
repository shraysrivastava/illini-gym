import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import {
  ScrollView,
  RefreshControl,
  View,
  Keyboard,
} from "react-native";

import { db, auth } from "../../firebase/firebaseConfig";
import {
  getDoc,
  doc,
  collection,
  updateDoc,
  arrayRemove,
  deleteField,
} from "firebase/firestore";
import Colors from "../../constants/Colors";
import FavoriteInstructions from "./FavoritesInstructions";
import { StyleSheet } from "react-native";
import {modalStyles,} from "../Maps/Gym/SectionModal";
import { RemoveSingle } from "../Reusables/RemoveSingle";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import CustomToast, { ToastProps } from "../Reusables/Toast";
import FavoriteModal from "./FavoriteModal";
import { FavoriteStackParamList } from "./FavoritesNav";
import { useNavigation } from '@react-navigation/native';
import { useFavorites, SectionDetails } from './useFavorites';

interface FavoritesProps {
  sections: SectionDetails[];
}
interface EditableNicknames {
  [key: string]: string;
}


export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const currentUserId = auth.currentUser?.uid;
  const route = useRoute<RouteProp<FavoriteStackParamList, 'FavoritesScreen'>>();
  const isEditMode = route.params?.isEditMode || false
  const [editableNicknames, setEditableNicknames] = useState<EditableNicknames>({});
  const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { favorites, setFavorites, favoriteSections, setFavoriteSections,
          sectionNicknames, setSectionNicknames, fetchAndUpdateFavorites,
  } = useFavorites(currentUserId);
  const openSections = favoriteSections.filter((favorite) => favorite.isOpen);
  const closedSections = favoriteSections.filter((favorite) => !favorite.isOpen);  
  const [markedForDeletion, setMarkedForDeletion] = useState<string[]>([]);

  useEffect(() => {
    fetchAndUpdateFavorites();
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      // setToastMessage("");
    }
    handleEditMode();
  }, [fetchAndUpdateFavorites, route.params]);

  useFocusEffect(
    useCallback(() => {
      
      fetchAndUpdateFavorites();
    }, [fetchAndUpdateFavorites])
  );

  const handleToggleMarkForDeletion = (id: string, sectionName:string, mark: boolean) => {
    setMarkedForDeletion(current => {
      if (mark) {
        setToast({ message: sectionName + " marked for deletion", color: Colors.uiucOrange });
        return [...current, id]; // Add to marked list
      } else {
        return current.filter(item => item !== id); // Remove from marked list
      }
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAndUpdateFavorites().then(() => setRefreshing(false));
  }, [fetchAndUpdateFavorites]);
  
  const handleSave = useCallback(async () => {
    const userDocRef = doc(collection(db, "users"), currentUserId);
    const updates: Record<string, any> = {};
  
    // Handle deletions
    if (markedForDeletion.length > 0) {
      updates.favorites = favorites.filter(fav => !markedForDeletion.includes(fav));
      markedForDeletion.forEach(key => {
        updates[`nicknames.${key}`] = deleteField();
      });
    }
    console.log(updates);
  
    // Handle nickname updates
    Object.keys(editableNicknames).forEach((key) => {
      if (editableNicknames[key] !== sectionNicknames[key]) {
        updates[`nicknames.${key}`] = editableNicknames[key];
      }
    });
  
    // Check if there are updates to be made
    if (Object.keys(updates).length > 0) {
      try {
        setToast({ message: "Changes Successfully Saved", color: "green" });
        await updateDoc(userDocRef, updates);
        fetchAndUpdateFavorites();
      } catch (error) {
        console.error("Error updating data:", error);
        setToast({ message: "Error updating data", color: "red" });
      }
    }
  
    setMarkedForDeletion([]);
  }, [editableNicknames, sectionNicknames, currentUserId, fetchAndUpdateFavorites, markedForDeletion, favorites]);

  
  const handleEditMode = () => {
    switch (route.params?.action) {
      case "save":
        handleSave();
        break;
      case "cancel":
        const changesMade = Object.keys(editableNicknames).some(
          key => editableNicknames[key] !== sectionNicknames[key]
        ) || markedForDeletion.length > 0;
  
        if (changesMade) {
          setToast({ message: "Changes Discarded", color: "red" });
        }
        
        setEditableNicknames({});
        setMarkedForDeletion([]); 
        break;
      case "editModeOn":
        // setToast({ message: "Edit Mode Enabled", color: Colors.uiucOrange });
        break;
      default:
        // Handle any other cases or do nothing
        break;
    }
  };
  
  const updateNickname = useCallback((id: string, newNickname: string) => {
    setEditableNicknames({
      ...editableNicknames,
      [id]: newNickname,
    });
  }, [editableNicknames]
  );

  const Favorites: React.FC<FavoritesProps> = React.memo(
    ({ sections }) => (
      <View style={modalStyles.listContainer}>
        {sections.map((section, index) => (
          <FavoriteModal
          key={section.gym + "=" + section.key}
          fullID={section.gym + "=" + section.key}
          section={section}
          isEditMode={isEditMode}
          isMarkedForDeletion={markedForDeletion.includes(section.gym + "=" + section.key)}
          handleToggleMarkForDeletion={handleToggleMarkForDeletion}
          sectionNicknames={sectionNicknames}
          editableNicknames={editableNicknames}
          updateNickname={updateNickname}
        />
        ))}
      </View>
    )
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.beige]} // for Android
            tintColor={Colors.beige} // Color for the spinner (iOS)
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {favorites.length !== 0 ? (
          <View>
            <Favorites sections={openSections} />
            <Favorites sections={closedSections} />
          </View>

        ) : (
          <FavoriteInstructions />
        )}
      </ScrollView>

      <CustomToast message={toast.message} color={toast.color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnightBlue,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    paddingBottom: 15,
    margin: 5,
  },
  editModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 5, 
  },
  cancelIcon: {
    alignSelf: 'flex-start',
  },
  saveIcon: {
    alignSelf: 'flex-end',
  },
  editIcon: {
    // Style for the edit icon, if needed
  },
});