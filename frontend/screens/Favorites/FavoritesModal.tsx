import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  RefreshControl,
  View,
  Button,
  Touchable,
  Alert,
  Modal,
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
} from "firebase/firestore";
import Colors from "../../constants/Colors";
import CustomText from "../Reusables/CustomText";
import FavoriteInstructions from "./FavoritesInstructions";
import { StyleSheet } from "react-native";
// ... Import other necessary components and libraries ...

interface SectionDetails {
  isOpen: boolean;
  name: string;
  lastUpdated: string;
  count: number;
  capacity: number;
  key: string;
}

interface FavoritesModalProps {
  sections: { gym: string; section: SectionDetails }[];
  // Include any other props needed
}

const FavoritesModal: React.FC<FavoritesModalProps> = ({ sections }) => {
  // ... Include the necessary functions and component code ...
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteSections, setFavoriteSections] = useState<{ gym: string; section: SectionDetails }[]>([]);
  const [sectionNicknames, setSectionNicknames] = useState<Record<string, string>>({});

  const removeFromFavorites = useCallback(
    (gym: string, sectionKey: string) => {
      const userDocRef = doc(collection(db, "users"), currentUserId);
      const favoriteKey = gym + "=" + sectionKey;

      updateDoc(userDocRef, { favorites: arrayRemove(favoriteKey) }).then(
        () => {
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
    },
    [currentUserId]
  );

  const handleRemoveFavorite = (gym: string, sectionKey: string) => {
    console.log("Removing favorite:", gym, sectionKey);
    Alert.alert(
      "Remove Favorite",
      "Are you sure you want to remove this section from your favorites?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => removeFromFavorites(gym, sectionKey),
        },
      ]
    );
  };

  const getDisplayName = (gym: string, sectionKey: string, sectionName: string) => {
    const favoriteKey = `${gym}=${sectionKey}`;
    return sectionNicknames[favoriteKey] || sectionName;
  };

  return (
    <View style={styles.sectionContainer}>
      {sections.map(({ gym, section }, index) => (
        <View key={index} style={styles.gymContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.sectionHeader}>
              {section.isOpen ? (
                <MaterialIcons name="visibility" size={24} color="green" />
              ) : (
                <MaterialIcons name="visibility-off" size={24} color="red" />
              )}
              <CustomText style={styles.gymName}>
                {getDisplayName(gym, section.key, section.name)}
              </CustomText>
            </View>
            <MaterialIcons
              name={"cancel"}
              size={24}
              color={"gray"}
              style={styles.iconButton}
              onPress={() => handleRemoveFavorite(gym, section.key)}
            />
          </View>
          <CustomText style={styles.lastUpdated}>
            Last Updated: {section.lastUpdated}
          </CustomText>
          {section.isOpen ? (
            <View style={styles.progressBarContainer}>
              <Progress.Bar
                progress={section.count / section.capacity}
                width={250 - 60}
                color={
                  section.count / section.capacity <= 0.5
                    ? "#4CAF50"
                    : section.count / section.capacity < 0.8
                    ? "#FFE66D"
                    : "#FF6B6B"
                }
                unfilledColor="grey"
                style={{ marginRight: 10 }}
              />
              <CustomText style={styles.countCapacityText}>
                {section.count}/{section.capacity} People
              </CustomText>
            </View>
          ) : (
            <CustomText style={styles.unavailableText}>
              Section Data Unavailable
            </CustomText>
          )}
        </View>
      ))}
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
      paddingBottom: 20, // Adjust this value as needed
    },
    gymContainer: {
      margin: 10,
      padding: 10,
      backgroundColor: Colors.subtleWhite,
      borderColor: Colors.subtleWhite,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 2,
    },
    progressBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "flex-start",
      marginHorizontal: 10,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom:5
    },
    gymName: {
      fontSize: 20,
      fontWeight: "bold",
      marginLeft: 10,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconButton: {},
    sectionContainer: {
      width: "100%",
    },
    lastUpdated: {
      fontSize: 16,
      color: "gray",
      alignSelf: "flex-start",
      marginBottom: 5,
      marginHorizontal: 10,
    },
    countCapacityText: {
      fontSize: 15,
    },
  
    unavailableText: {
      fontSize: 16,
      color: '#D9534F',
      textAlign: 'center',
    },
  });

// Export the FavoriteModal component
export default FavoritesModal;
