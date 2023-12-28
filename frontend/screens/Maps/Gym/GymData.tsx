import React, { useState, useEffect, useCallback, useRef } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { ScrollView, View, RefreshControl } from "react-native";
import { db, auth } from "../../../firebase/firebaseConfig";
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
import { StackNavigationProp } from "@react-navigation/stack";
import { MapsStackParamList } from "../MapsNav";
import { SectionModals } from "./SectionModal";
import CustomToast from "../../Reusables/Toast";
import { StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";

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
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);


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
          const [favoriteGym, sectionDocID] = favoriteKey.split("=");
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
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
  }, [fetchGymData, loadFavorites]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchGymData();
    await loadFavorites();
    setRefreshing(false);
  }, [fetchGymData, loadFavorites]);

  const handleFavoritePress = useCallback((sectionKey: string, sectionName: string) => {
      const userDocRef = doc(collection(db, "users"), currentUserId);
      const favoriteKey = gym + "=" + sectionKey;
      const message = pressedSections[sectionKey] ? sectionName + ' removed from favorites' : sectionName + ' added to favorites';
      setToastMessage(message);
      if (pressedSections[sectionKey]) {
        updateDoc(userDocRef, { favorites: arrayRemove(favoriteKey) });
      } else {
        updateDoc(userDocRef, { favorites: arrayUnion(favoriteKey) });
      }
      setPressedSections((prev) => ({
        ...prev,
        [sectionKey]: !prev[sectionKey],
      }));

    }, [pressedSections, currentUserId]
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
        <SectionModals
          sections={openSections}
          pressedSections={pressedSections}
          handleFavoritePress={handleFavoritePress}
        />
        <SectionModals
          sections={closedSections}
          pressedSections={pressedSections}
          handleFavoritePress={handleFavoritePress}
        />
      </ScrollView>
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
});

