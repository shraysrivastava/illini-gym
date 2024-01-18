import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import {
  ScrollView,
  RefreshControl,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomText from "../Reusables/CustomText";


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
  const [markedForDeletion, setMarkedForDeletion] = useState<string[]>([]);
  const [originalFavorites, setOriginalFavorites] = useState<string[]>([]);
  const [originalFavoriteSections, setOriginalFavoriteSections] = useState<SectionDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAndUpdateFavorites();
      setIsLoading(false); // Set loading to false once data is fetched
    };

    fetchData();
    handleEditMode();
  }, [fetchAndUpdateFavorites, route.params]);
  
  // Separate useEffect for handling toast message reset
  useEffect(() => {
    if (toast.message !== "") {
      toastTimeoutRef.current = setTimeout(() => {
        setToast({ message: "", color: "" });
      }, 2000);
    }
  
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [toast.message]);

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
    if (favorites.length === 0) {
      setToast({ message: "No Favorites to Save", color: "red" });
      return;
    }
    const userDocRef = doc(collection(db, "users"), currentUserId);
    const updates: Record<string, any> = {};
    
    if (favorites !== originalFavorites) {
      updates.favorites = favorites;
    }
    
    // Handle deletions
    if (markedForDeletion.length > 0) {
      updates.favorites = favorites.filter(fav => !markedForDeletion.includes(fav));
      markedForDeletion.forEach(key => {
        updates[`nicknames.${key}`] = deleteField();
      });
    }
  
    // Handle nickname updates
    Object.keys(editableNicknames).forEach((key) => {
      if (editableNicknames[key] !== sectionNicknames[key]) {
        updates[`nicknames.${key}`] = editableNicknames[key];
      }
    });
    
    

    // Check if there are updates to be made
    if (Object.keys(updates).length > 0) {
      try {
        setIsLoading(true);
        setToast({ message: "Changes Successfully Saved", color: "green" });
        await updateDoc(userDocRef, updates);
        await fetchAndUpdateFavorites();
        setIsLoading(false);
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
        setFavorites(originalFavorites);
        setFavoriteSections(originalFavoriteSections);
        setEditableNicknames({});
        setMarkedForDeletion([]); 
        break;
      case "editModeOn":
        // setToast({ message: "Edit Mode Enabled", color: Colors.uiucOrange });
        setOriginalFavorites([...favorites]);
        setOriginalFavoriteSections([...favoriteSections]);

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

  const moveSection = (id: string, direction: "up" | "down"): void => {
    const index = favorites.indexOf(id);
    if (index < 0) return;
  
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= favorites.length) return;
  
    const newFavorites = [...favorites];
    [newFavorites[index], newFavorites[newIndex]] = [newFavorites[newIndex], newFavorites[index]];
    setFavorites(newFavorites);
  
    const newSections = [...favoriteSections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setFavoriteSections(newSections);
  };

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
          setToast={setToast}
          moveSection={moveSection}
        />
        ))}
      </View>
    )
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.uiucOrange} />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
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
      <View style={styles.container}>
        {isUpdating ? (
          <ActivityIndicator size="large" color={Colors.uiucOrange} />
        ) : favorites.length !== 0 ? (
          <Favorites sections={favoriteSections} />
        ) : (
          <View>
            <CustomText style={styles.headerText}>
              Enhance Your Gym Experience
            </CustomText>
            <FavoriteInstructions />
          </View>
        )}

        <CustomToast message={toast.message} color={toast.color} />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnightBlue,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.uiucOrange, // A lighter color for contrast
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.midnightBlue,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.midnightBlue,
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