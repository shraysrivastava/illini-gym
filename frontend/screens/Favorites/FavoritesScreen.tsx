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
import { SectionInfo, VisibilityIcon, modalStyles } from "../Maps/Gym/SectionModal";
import { getTimeDifference } from "../Reusables/Calculations";
import { RemovePopup } from "../Reusables/RemovePopup";
import { useFocusEffect } from '@react-navigation/native';
import CustomToast from "../Reusables/Toast";


interface SectionDetails {
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
  const [sectionNicknames, setSectionNicknames] = useState<Record<string, string>>({});
  const currentUserId = auth.currentUser?.uid;
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editableNicknames, setEditableNicknames] = useState<EditableNicknames>({});
  const [isRemovePopupVisible, setIsRemovePopupVisible] = useState(false);
  const [sectionToRemove, setSectionToRemove] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [toastMessage, setToastMessage] = useState('');
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);



  const fetchAndUpdateFavorites = useCallback(async () => {
    if (!currentUserId) return;
    setIsLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", currentUserId));
      if (!userDoc.exists()) return;

      const userFavorites: string[] = userDoc.data().favorites || [];
      setFavorites(userFavorites);

      const userNicknames: Record<string, string> = userDoc.data().nicknames || {};
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
    }
  }, [fetchAndUpdateFavorites]);

  useFocusEffect(
    useCallback(() => {
      fetchAndUpdateFavorites();
    }, [fetchAndUpdateFavorites])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAndUpdateFavorites().then(() => setRefreshing(false));
  }, [fetchAndUpdateFavorites]);

  const handleRemoveFavorite = (gym: string, sectionKey: string, sectionName: string) => {
    console.log("Removing favorite:", gym, sectionKey);
    setIsRemovePopupVisible(true);
    setSectionToRemove(gym + "=" + sectionKey);
    setSelectedSection(sectionName);
  };

  const getDisplayName = (gym: string, sectionKey: string, sectionName: string) => {
    const favoriteKey = `${gym}=${sectionKey}`;
    return sectionNicknames[favoriteKey] || sectionName;
  };

  const removeFromFavorites = useCallback((favoriteKey: string, sectionName: string) => {
      const userDocRef = doc(collection(db, "users"), currentUserId);
      console.log("Removing from favorites:", favoriteKey);
      const message = sectionNicknames[favoriteKey] ? sectionNicknames[favoriteKey] + ' removed from favorites' : sectionName + ' removed from favorites';
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
    [currentUserId]
  );

  const handleNicknameUpdate = useCallback(() => {
    const userDocRef = doc(collection(db, "users"), currentUserId);
    updateDoc(userDocRef, {
      nicknames: editableNicknames,
    });
    fetchAndUpdateFavorites();
  }, [editableNicknames, currentUserId]);

  const onSavePress = () => {
    setToastMessage('Changes Saved');
    handleNicknameUpdate();
    setIsEditMode(false);
    fetchAndUpdateFavorites();
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      setEditableNicknames({});
      setToastMessage('Changes Discarded');
    }
    setIsEditMode(!isEditMode);
  };

  const updateNickname = (id: string, newNickname: string) => {
    setEditableNicknames({
      ...editableNicknames,
      [id]: newNickname
    });
  };

  const Favorites: React.FC<FavoriteModalsProps> = React.memo(({sections}) => (
    <View style={modalStyles.listContainer}>
      {sections.map(({ gym, section }, index) => (
        <FavoriteModal
          key={gym + "=" + section.key}
          id={gym + "=" + section.key}
          gym={gym}
          section={section}
          updateNickname={updateNickname}
        />
      ))}
    </View>
  ));
  

  const FavoriteModal: React.FC<FavoriteModalProps> = React.memo(({section, gym, id}) => {
    const timeDiff = getTimeDifference(section.lastUpdated);
    return (
      <View style={modalStyles.individualSectionContainer}>
        {/* Top Row: Visibility Icon, Section Name, and Star Icon */}
        <View style={modalStyles.row}>
          <VisibilityIcon isOpen={section.isOpen} />
          {isEditMode ? (
            <TextInput
              style={modalStyles.sectionName}
              value={editableNicknames[id] || section.name}
              onChangeText={(text) =>
                setEditableNicknames({
                  ...editableNicknames,
                  [id]: text,
                })}
                placeholderTextColor={"gray"}
                maxLength={20}
              // style and other props
            />
          ) : (
            <CustomText style={modalStyles.sectionName}>
              {getDisplayName(gym, section.key, section.name)}
            </CustomText>
          )}
          <MaterialIcons
            name="remove-circle-outline"
            size={24}
            color="red"
            style={modalStyles.starIcon}
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
  });

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="edit"
        color={isEditMode ? Colors.uiucOrange : Colors.beige}
        size={24}
        onPress={toggleEditMode}
      />

      <ScrollView
        style={styles.scrollView}
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
      {isEditMode && (
        <View style={styles.buttonContainer}>
        <TouchableHighlight
          style={styles.cancelButton}
          onPress={toggleEditMode}
        >
          <CustomText style={styles.buttonText}>Cancel</CustomText>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.saveButton}
          onPress={onSavePress}
        >
          <CustomText style={styles.buttonText}>Save</CustomText>
        </TouchableHighlight>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 15,
  },
  saveButton: {
    backgroundColor: Colors.uiucOrange,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: Colors.uiucBlue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  
});

