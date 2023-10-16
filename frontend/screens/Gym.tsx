import React, { useState, useEffect, useCallback } from "react";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import * as Progress from "react-native-progress";
import { MaterialIcons } from "@expo/vector-icons";
import { db, auth } from "../firebase/firebaseConfig";
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
} from "firebase/firestore";
import colors from "../constants/Colors";
import CustomText from "./Reusables/CustomText";
import { tabParamsList } from "./Nav";

type GymProps = {
  route: RouteProp<tabParamsList, "Gym">;
};

export const Gym = ({ route }: GymProps) => {
  const [arcData, setArcData] = useState<DocumentData[]>([]);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [pressedGyms, setPressedGyms] = useState<Record<string, boolean>>({});
  const currentUserId = auth.currentUser?.uid;
  const openGyms = arcData.filter((gym) => gym.isOpen);
  const closedGyms = arcData.filter((gym) => !gym.isOpen);

  const fetchArcData = useCallback(() => {
    const gymQuery = query(collection(db, "arc"));
    getDocs(gymQuery)
      .then((arcList: QuerySnapshot<DocumentData>) => {
        const fetchedData = arcList.docs.map((doc) => ({
          ...doc.data(),
          key: doc.id,
        }));
        setArcData(fetchedData);
      })
      .catch((err: FirestoreError) => {
        console.error("Error fetching arc data: ", err.message);
      });
  }, []);

  useEffect(() => {
    fetchArcData();
  }, [fetchArcData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchArcData();
    setTimeout(() => {
      setRefreshing(false);
    }, 400);
  }, [fetchArcData]);

  const handleFavoritePress = useCallback(
    (gymDocID: string) => {
      const userDocRef = doc(collection(db, "users"), currentUserId);
      if (pressedGyms[gymDocID]) {
        updateDoc(userDocRef, { favorites: arrayRemove(gymDocID) });
      } else {
        updateDoc(userDocRef, { favorites: arrayUnion(gymDocID) });
      }
      setPressedGyms((prev) => ({
        ...prev,
        [gymDocID]: !prev[gymDocID],
      }));
    },
    [pressedGyms, currentUserId]
  );

  const renderGymSection = (gyms: DocumentData[], sectionTitle: string) => (
    <View style={styles.sectionContainer}>
      <CustomText style={styles.sectionTitle}>{sectionTitle}</CustomText>
      {gyms.map((gym, index) => (
        <View
          key={index}
          style={[
            styles.gymContainer,
            gym.isOpen ? styles.openBorder : styles.closedBorder,
          ]}
        >
          <View style={styles.headerContainer}>
            <CustomText style={styles.gymName}>{gym.name}</CustomText>
            <MaterialIcons
              name={pressedGyms[gym.key] ? "check-circle" : "add-circle"}
              size={24}
              color={pressedGyms[gym.key] ? "green" : "gray"}
              style={styles.iconButton}
              onPress={() => handleFavoritePress(gym.key)}
            />
          </View>
          <View style={styles.progressBarContainer}>
            <Progress.Bar
              progress={gym.count / gym.capacity}
              width={250 - 60}
              color={
                gym.count / gym.capacity <= 0.5
                  ? "#4CAF50"
                  : gym.count / gym.capacity < 0.8
                  ? "#FFE66D"
                  : "#FF6B6B"
              }
              unfilledColor="grey"
              style={{ marginRight: 10 }}
            />

            <CustomText>
              {gym.count}/{gym.capacity}
            </CustomText>
          </View>
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
        {renderGymSection(openGyms, "Open Gyms")}
        {renderGymSection(closedGyms, "Closed Gyms")}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.midnightBlue,
    width: 400,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  gymContainer: {
    width: "90%",
    margin: 10,
    padding: 10,
    backgroundColor: colors.subtleWhite,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
  },
  openBorder: {
    borderColor: "green",
    borderWidth: 2,
  },
  closedBorder: {
    borderColor: "red",
    borderWidth: 2,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "flex-start",
  },
  addButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  gymName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  iconButton: {},
  sectionContainer: {
    width: "100%",
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
});
