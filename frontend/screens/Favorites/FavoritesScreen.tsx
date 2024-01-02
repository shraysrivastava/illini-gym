import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ScrollView,
  RefreshControl,
  View,
  Button,
  Touchable,
  Alert,
  Modal,
  TextInput,
  TouchableHighlight,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Progress from "react-native-progress";
import { MaterialIcons } from "@expo/vector-icons";
import { db, auth } from "../../firebase/firebaseConfig";
import {
  getDoc,
  doc,
  collection,
  updateDoc,
  arrayRemove,
  arrayUnion,
  deleteField,
} from "firebase/firestore";
import Colors from "../../constants/Colors";
import CustomText from "../Reusables/CustomText";
import FavoriteInstructions from "./FavoritesInstructions";
import { StyleSheet } from "react-native";
import {
  SectionInfo,
  VisibilityIcon,
  modalStyles,
} from "../Maps/Gym/SectionModal";
import { getTimeDifference } from "../Reusables/Utilities";
import { RemovePopup } from "../Reusables/RemovePopup";
import { useFocusEffect } from "@react-navigation/native";
import CustomToast from "../Reusables/Toast";
import FavoriteModal from "./FavoriteModal";

export interface SectionDetails {
  isOpen: boolean;
  name: string;
  lastUpdated: string;
  count: number;
  capacity: number;
  key: string;
}

interface FavoriteModalsProps {
  sections: { gym: string; section: SectionDetails }[];
}

type FavoriteModalProps = {
  id: string;
  section: SectionDetails;
  gym: string;
  updateNickname: (id: string, newNickname: string) => void;
};

interface EditableNicknames {
  [key: string]: string;
}

export const FavoritesScreen: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteSections, setFavoriteSections] = useState<{ gym: string; section: SectionDetails }[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sectionNicknames, setSectionNicknames] = useState< Record<string, string>>({});
  const currentUserId = auth.currentUser?.uid;
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editableNicknames, setEditableNicknames] = useState<EditableNicknames>({});
  const [isRemovePopupVisible, setIsRemovePopupVisible] = useState(false);
  const [sectionToRemove, setSectionToRemove] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAndUpdateFavorites = useCallback(async () => {
    if (!currentUserId) return;
    setIsLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", currentUserId));
      if (!userDoc.exists()) return;

      const userFavorites: string[] = userDoc.data().favorites || [];
      setFavorites(userFavorites);

      const userNicknames: Record<string, string> =
        userDoc.data().nicknames || {};
      setSectionNicknames(userNicknames);

      const newPressedSections: Record<string, boolean> = {};
      const promises = userFavorites.map(async (fav) => {
        const [gym, sectionId] = fav.split("=");
        const sectionDoc = await getDoc(doc(db, gym, sectionId));
        newPressedSections[sectionId] = true; // Update pressedSections
        return sectionDoc.exists()
          ? { gym, section: { key: sectionId, ...sectionDoc.data() } }
          : null;
      });

      const fetchedData = (await Promise.all(promises)).filter(Boolean);
      setFavoriteSections(
        fetchedData as { gym: string; section: SectionDetails }[]
      );
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
    setIsLoading(false);
  }, [currentUserId]);

  useEffect(() => {
    fetchAndUpdateFavorites();
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      setToastMessage("");
    }
  }, [fetchAndUpdateFavorites]);

  useFocusEffect(
    useCallback(() => {
      fetchAndUpdateFavorites();
      setIsEditMode(false);
    }, [fetchAndUpdateFavorites])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAndUpdateFavorites().then(() => setRefreshing(false));
  }, [fetchAndUpdateFavorites]);

  const handleRemoveFavorite = useCallback((gym: string, sectionKey: string, sectionName: string) => {
    console.log("Removing favorite:", gym, sectionKey);
    setIsRemovePopupVisible(true);
    setSectionToRemove(gym + "=" + sectionKey);
    setSelectedSection(sectionName);
  }, []
  );


  const removeFromFavorites = useCallback(
    (favoriteKey: string, sectionName: string) => {
      const userDocRef = doc(collection(db, "users"), currentUserId);
      console.log("Removing from favorites:", favoriteKey);
      const message = sectionNicknames[favoriteKey]
        ? sectionNicknames[favoriteKey] + " removed from favorites"
        : sectionName + " removed from favorites";
      setToastMessage(message);
      updateDoc(userDocRef, { favorites: arrayRemove(favoriteKey) }).then(
        () => {
          // Also remove the nickname associated with this section
          updateDoc(userDocRef, {
            [`nicknames.${favoriteKey}`]: deleteField(),
          });
          // Update local state to reflect the removal
          setFavorites((favs) => favs.filter((fav) => fav !== favoriteKey));

          // Optionally, you can also update favoriteSections state to immediately reflect the change
          setFavoriteSections((sections) =>
            sections.filter(
              (section) =>
                section.gym + "=" + section.section.key !== favoriteKey
            )
          );
        }
      );
      setIsRemovePopupVisible(false);
    },
    [currentUserId, favoriteSections, sectionNicknames]
  );



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
        await updateDoc(userDocRef, updates);
        fetchAndUpdateFavorites();
      } catch (error) {
        console.error("Error updating nicknames:", error);
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

  const onSavePress = () => {
    setToastMessage("Changes Saved");
    handleNicknameUpdate();
    setIsEditMode(false);
  };

  const onCancelPress = () => {
    if (isEditMode) {
      setEditableNicknames({});
      setToastMessage("Changes Discarded");
    }
    setIsEditMode(!isEditMode);
  };

  const updateNickname = useCallback((id: string, newNickname: string) => {
    setEditableNicknames({
      ...editableNicknames,
      [id]: newNickname,
    });
  }, [editableNicknames]
  );

  const Favorites: React.FC<FavoriteModalsProps> = React.memo(
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
      {isEditMode ? (
        <View style={styles.editModeContainer}>
          <MaterialIcons
            name="close"
            color="red"
            size={28}
            onPress={onCancelPress}
            style={styles.cancelIcon}
          />
          <MaterialIcons
            name="check"
            color="green"
            size={28}
            onPress={onSavePress}
            style={styles.saveIcon}
          />
        </View>
      ) : (
        <MaterialIcons
          name="edit"
          color={Colors.beige}
          size={24}
          onPress={() => setIsEditMode(true)}
          style={styles.editIcon}
        />
      )}

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
        {isLoading && favorites.length === 0 ? (
          <></>
        ) : // <ActivityIndicator size="large" color={Colors.uiucOrange} />
        favorites.length !== 0 ? (
          <Favorites sections={favoriteSections} />
        ) : (
          <FavoriteInstructions />
        )}
      </ScrollView>
      {isRemovePopupVisible && (
        <RemovePopup
          isVisible={isRemovePopupVisible}
          onCancel={() => setIsRemovePopupVisible(false)}
          onConfirm={removeFromFavorites}
          favoriteKey={sectionToRemove}
          sectionName={sectionNicknames[sectionToRemove] || selectedSection}
        />
      )}

      <CustomToast message={toastMessage} />
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
    paddingBottom: 15, // Adjust this value as needed
    margin: 5,
  },
  editModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10, // Adjust as needed
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
