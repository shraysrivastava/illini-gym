import React, { useState, useEffect, useCallback } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, RefreshControl } from "react-native";
import * as Progress from "react-native-progress";
import { MaterialIcons } from "@expo/vector-icons";
import { db, auth } from "../../firebase/firebaseConfig";
import {
  getDocs,
  query,
  FirestoreError,
  DocumentData,
  QuerySnapshot,
  collection,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import Colors from "../../constants/Colors";
import { styles } from "../Reusables/ModalStyles";
import CustomText from "../Reusables/CustomText";
import { StackNavigationProp } from "@react-navigation/stack";
import { MapsStackParamList } from "./MapsNav";

export type GymDataProps = {
  route: RouteProp<Record<string, object>, "GymData"> & {
    params: { gym: "arc" | "crce" };
  };
};

export const GymData: React.FC<GymDataProps> = ({ route }) => {
  const navigation =
    useNavigation<StackNavigationProp<MapsStackParamList, "GymData">>();
  const { gym } = route.params;
  const [gymData, setGymData] = useState<DocumentData[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [pressedSections, setPressedSections] = useState<
    Record<string, boolean>
  >({});
  const currentUserId = auth.currentUser?.uid;
  const openSections = gymData.filter((section) => section.isOpen);
  const closedSections = gymData.filter((section) => !section.isOpen);

  const fetchGymData = useCallback(async () => {
    const gymQuery = query(collection(db, gym));
    getDocs(gymQuery)
      .then((sectionList: QuerySnapshot<DocumentData>) => {
        const fetchedData = sectionList.docs.map((doc) => ({
          ...doc.data(),
          key: doc.id,
        }));
        setGymData(fetchedData);
      })
      .catch((err: FirestoreError) => {
        console.error("Error fetching {gym} data: ", err.message);
      });
  }, [gym]);

  const loadFavorites = useCallback(async () => {
    const userDocRef = doc(collection(db, "users"), currentUserId);
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const favorites = userData.favorites || [];
        console.log(favorites);
        // Filter favorites for the current gym and update pressedSections
        const updatedPressedSections: { [key: string]: boolean } = {};
        favorites.forEach((favoriteKey: string) => {
          const [favoriteGym, sectionDocID] = favoriteKey.split("/");
          if (favoriteGym === gym) {
            updatedPressedSections[sectionDocID] = true;
          }
        });
        setPressedSections(updatedPressedSections);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }, [db, currentUserId, gym]);

  useEffect(() => {
    const loadData = async () => {
      await fetchGymData();
      await loadFavorites();
    };
    loadData();
  }, [fetchGymData, loadFavorites]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchGymData();
    await loadFavorites();
    setRefreshing(false);
  }, [fetchGymData, loadFavorites]);

  const handleFavoritePress = useCallback(
    (sectionDocID: string) => {
      const userDocRef = doc(collection(db, "users"), currentUserId);
      const favoriteKey = gym + "/" + sectionDocID;
      if (pressedSections[sectionDocID]) {
        updateDoc(userDocRef, { favorites: arrayRemove(favoriteKey) });
      } else {
        updateDoc(userDocRef, { favorites: arrayUnion(favoriteKey) });
      }
      setPressedSections((prev) => ({
        ...prev,
        [sectionDocID]: !prev[sectionDocID],
      }));
    },
    [pressedSections, currentUserId]
  );

  const SectionModal = (sections: DocumentData[]) => (
    <View style={styles.sectionContainer}>
      {sections.map((section, index) => (
        <View key={index} style={styles.gymContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.sectionHeader}>
              {section.isOpen ? (
                <MaterialIcons name="visibility" size={24} color="green" />
              ) : (
                <MaterialIcons name="visibility-off" size={24} color="red" />
              )}
              <CustomText style={styles.gymName}>{section.name}</CustomText>
            </View>
            <MaterialIcons
              name={pressedSections[section.key] ? "star" : "star-outline"}
              size={24}
              color={pressedSections[section.key] ? "green" : "gray"}
              style={styles.iconButton}
              onPress={() => handleFavoritePress(section.key)}
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
              Section Closed
            </CustomText>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {SectionModal(openSections)}
        {SectionModal(closedSections)}
      </ScrollView>
    </View>
  );
};
