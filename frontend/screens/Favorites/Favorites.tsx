import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Progress from "react-native-progress";
import { MaterialIcons } from "@expo/vector-icons";
import { db, auth } from "../../firebase/firebaseConfig";
import {
  getDoc,
  doc,
  DocumentData,
  collection,
  getDocs,
  query,
  where,
  QuerySnapshot,
} from "firebase/firestore";
import Colors from "../../constants/Colors";
import CustomText from "../Reusables/CustomText";
import { styles } from "../Gym/GymData"; // Reuse the styles from GymData

export const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteSections, setFavoriteSections] = useState<DocumentData[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const currentUserId = auth.currentUser?.uid;

  const openSections = favoriteSections.filter((section) => section.isOpen);
  const closedSections = favoriteSections.filter((section) => !section.isOpen);

  const fetchFavorites = async () => {
    if (!currentUserId) return;

    const userDoc = await getDoc(doc(db, "users", currentUserId));

    if (userDoc.exists()) {
      const userFavorites: string[] = userDoc.data().favorites || [];
      setFavorites(userFavorites);
      const sectionsQuery = query(
        collection(db, "arc"),
        where("id", "in", userFavorites)
      );
      getDocs(sectionsQuery)
        .then((sectionList: QuerySnapshot<DocumentData>) => {
          const fetchedData = sectionList.docs.map((doc) => ({
            ...doc.data(),
            key: doc.id,
          }));
          setFavoriteSections(fetchedData);
        })
        .catch((error) => {
          console.error("Error fetching documents:", error);
        });
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [currentUserId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Re-fetch the favorites
    fetchFavorites().then(() => {
      setRefreshing(false);
    });
  }, []);

  const renderGymSection = (sections: DocumentData[], sectionTitle: string) => (
    <View style={styles.sectionContainer}>
      <CustomText style={styles.sectionTitle}>{sectionTitle}</CustomText>
      {sections.map((section, index) => (
        <View
          key={index}
          style={[
            styles.gymContainer,
            section.isOpen ? styles.openBorder : styles.closedBorder,
          ]}
        >
          <View style={styles.headerContainer}>
            <CustomText style={styles.gymName}>{section.name}</CustomText>
            <MaterialIcons
              name="remove-circle"
              size={24}
              color="gray"
              style={styles.iconButton}
              onPress={() => {
                // Logic to remove from favorites
              }}
            />
          </View>
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
              <CustomText>
                {section.count}/{section.capacity}
              </CustomText>
            </View>
          ) : (
            <CustomText style={styles.closedText}>Closed</CustomText>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderGymSection(openSections, "Favorited Open Sections")}
        {renderGymSection(closedSections, "Favorited Closed Sections")}
      </ScrollView>
    </SafeAreaView>
  );
};
