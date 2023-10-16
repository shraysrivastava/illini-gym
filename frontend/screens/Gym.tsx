import React, { useState, useEffect, useCallback } from "react";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase/firebaseConfig"; // Adjust this import based on your project structure
import {
  collection,
  getDocs,
  query,
  where,
  FirestoreError,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { StyleSheet } from "react-native";
import colors from "../constants/colors";
import CustomText from "./Reusables/CustomText";
import { tabParamsList } from "./Nav";
import { View } from "react-native";
import * as Progress from "react-native-progress";
import { MaterialIcons } from "@expo/vector-icons";

type GymProps = {
  route: RouteProp<tabParamsList, "Gym">;
};

export const Gym = ({ route }: GymProps) => {
  const [arcData, setArcData] = useState<DocumentData[]>([]);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [pressedGyms, setPressedGyms] = useState<Record<string, boolean>>({});

  const handleButtonPress = (gymName: string) => {
    setPressedGyms((prev) => ({
      ...prev,
      [gymName]: !prev[gymName], // Toggle the pressed status
    }));
  };
  const setTemporaryError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  const fetchArcData = () => {
    const q = query(collection(db, "arc"));

    getDocs(q)
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
  };

  useEffect(() => {
    fetchArcData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchArcData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {arcData.map((gym, index) => (
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
              name={pressedGyms[gym.name] ? "check-circle" : "add-circle"}
              size={24}
              color={pressedGyms[gym.name] ? "green" : "gray"}
              style={styles.iconButton}
              onPress={() => handleButtonPress(gym.name)}
            />
          </View>
          <View style={styles.progressBarContainer}>
            <Progress.Bar
              progress={gym.count / gym.capacity}
              width={250 - 60}
              color={
                gym.count / gym.capacity <= 0.5 ? "#FF6B6B"
                : gym.count / gym.capacity < 0.8 ? "#FFE66D"
                : "#4CAF50"
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.midnightBlue,
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
  iconButton: {
    // No changes here
  },
});
