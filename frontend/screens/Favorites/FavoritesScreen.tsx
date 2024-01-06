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
import { RemoveAll } from "../Reusables/RemoveAll";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import CustomToast, { ToastProps } from "../Reusables/Toast";
import FavoriteModal from "./FavoriteModal";
import { FavoriteStackParamList } from "./FavoritesNav";
import { useNavigation } from '@react-navigation/native';
import { useFavorites, SectionDetails } from './useFavorites';

interface FavoritesProps {
  sections: { gym: string; section: SectionDetails }[];
}
interface EditableNicknames {
  [key: string]: string;
}


export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation();
 
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const currentUserId = auth.currentUser?.uid;
  const route = useRoute<RouteProp<FavoriteStackParamList, 'FavoritesScreen'>>();
  
  const isEditMode = route.params?.isEditMode || false;
  const [showRemoveAllModal, setShowRemoveAllModal] = useState<boolean>(false);

  
  const [editableNicknames, setEditableNicknames] = useState<EditableNicknames>({});
  const [isRemoveSingleVisible, setRemoveSingleVisible] = useState(false);
  const [sectionToRemove, setSectionToRemove] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { favorites, setFavorites, favoriteSections, setFavoriteSections,
          sectionNicknames, setSectionNicknames, fetchAndUpdateFavorites,
  } = useFavorites(currentUserId);

  useEffect(() => {
    fetchAndUpdateFavorites();
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      // setToastMessage("");
    }
    handleEditMode();
    setShowRemoveAllModal(!!route.params?.isRemoveAll);
  }, [fetchAndUpdateFavorites, route.params]);

  useFocusEffect(
    useCallback(() => {
      
      fetchAndUpdateFavorites();
    }, [fetchAndUpdateFavorites])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAndUpdateFavorites().then(() => setRefreshing(false));
  }, [fetchAndUpdateFavorites]);

  const handleRemoveFavorite = useCallback((gym: string, sectionKey: string, sectionName: string) => {
    console.log("Removing favorite:", gym, sectionKey);
    setRemoveSingleVisible(true);
    setSectionToRemove(gym + "=" + sectionKey);
    setSelectedSection(sectionName);
  }, []
  );


  const removeSingleFromFavorites = useCallback(async (favoriteKey: string, sectionName: string) => {
    const userDocRef = doc(collection(db, "users"), currentUserId);
    console.log("Removing from favorites:", favoriteKey);
  
    try {
      await updateDoc(userDocRef, { favorites: arrayRemove(favoriteKey) });
      // Optionally, remove the nickname associated with this section
      await updateDoc(userDocRef, { [`nicknames.${favoriteKey}`]: deleteField() });
  
      // Update local state to reflect the removal
      setFavorites(favs => favs.filter(fav => fav !== favoriteKey));
      setFavoriteSections(sections => sections.filter(section => section.gym + "=" + section.section.key !== favoriteKey));
  
      // Success message
      const successMessage = sectionNicknames[favoriteKey] ? 
        `${sectionNicknames[favoriteKey]} removed from favorites` : 
        `${sectionName} removed from favorites`;
      setToast({ message: successMessage, color: "green" });
    } catch (error) {
      console.error("Error removing favorite:", error);
      setToast({ message: "Failed to remove favorite", color: "red" });
    }
  
    setRemoveSingleVisible(false);
  }, [currentUserId, favoriteSections, sectionNicknames]);

  const removeAllFromFavorites = useCallback(async () => {
    navigation.setOptions({ isRemoveAll: false });
    const userDocRef = doc(collection(db, "users"), currentUserId);
    setShowRemoveAllModal(false);
    setToast({ message: "Removing all favorites...", color: Colors.uiucOrange });
  
    try {
      await updateDoc(userDocRef, { favorites: [] });
      await updateDoc(userDocRef, { nicknames: {} });
  
      // Update local state to reflect the removal
      setFavorites([]);
      setFavoriteSections([]);
  
      // Success message
      setToast({ message: "All favorites removed", color: "green" });
    } catch (error) {
      console.error("Error removing all favorites:", error);
      setToast({ message: "Failed to remove all favorites", color: "red" });
    }
  
    
  }, [currentUserId, favoriteSections, sectionNicknames]);
  

  const handleNicknameUpdate = useCallback(async () => {
    const userDocRef = doc(collection(db, "users"), currentUserId);

    // Prepare the updates object
    const updates: Record<string, any> = {};

    // Iterate through the editableNicknames
    Object.keys(editableNicknames).forEach((key) => {
      if (editableNicknames[key] !== sectionNicknames[key]) {
        updates[`nicknames.${key}`] = editableNicknames[key];
      }
    });

    // Check if there are updates to be made
    if (Object.keys(updates).length > 0) {
      try {
        setToast({ message: "Changes Successfuly Saved", color: "green" });
        console.log("Updating nicknames:", updates);
        await updateDoc(userDocRef, updates);
        fetchAndUpdateFavorites();
      } catch (error) {
        console.error("Error updating nicknames:", error);
        setToast({ message: "Error updating nicknames", color: "red" });
      }
    } else {
      console.log("No nickname updates to be made.");
    }
  }, [
    editableNicknames,
    sectionNicknames,
    currentUserId,
    fetchAndUpdateFavorites,
  ]);

  const handleEditMode = () => {
    switch (route.params?.action) {
      case "save":
        handleNicknameUpdate();
        break;
      case "cancel":
        const changesMade = Object.keys(editableNicknames).some(
          key => editableNicknames[key] !== sectionNicknames[key]
        );
  
        if (changesMade) {
          setToast({ message: "Changes Discarded", color: "red" });
        }
        
        setEditableNicknames({});
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
        {sections.map(({ gym, section }, index) => (
          <FavoriteModal
          key={gym + "=" + section.key}
          id={gym + "=" + section.key}
          gym={gym}
          section={section}
          isEditMode={isEditMode}
          sectionNicknames={sectionNicknames}
          editableNicknames={editableNicknames}
          handleRemoveFavorite={handleRemoveFavorite}
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
          <Favorites sections={favoriteSections} />
        ) : (
          <FavoriteInstructions />
        )}
      </ScrollView>

      <RemoveSingle
        isVisible={isRemoveSingleVisible}
        onCancel={() => setRemoveSingleVisible(false)}
        onConfirm={removeSingleFromFavorites}
        favoriteKey={sectionToRemove}
        sectionName={sectionNicknames[sectionToRemove] || selectedSection}
      />

      <RemoveAll
        isVisible={showRemoveAllModal}
        onCancel={() => {
          navigation.setOptions({ isRemoveAll: false })
          setShowRemoveAllModal(false);
        }}
        onConfirm={() => {
          removeAllFromFavorites();
          // navigation.setOptions({ isRemoveAll: false }); // Hide modal after confirming
          // setShowRemoveAllModal(false);
        }}
      />

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
