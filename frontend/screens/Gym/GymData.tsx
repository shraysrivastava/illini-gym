import React, { useState, useEffect, useCallback } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
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
} from "firebase/firestore";
import Colors from "../../constants/Colors";
import CustomText from "../Reusables/CustomText";
import { StackNavigationProp } from "@react-navigation/stack";
import { GymStackParamList } from "./GymMain";

type GymDataProps = {
  route: RouteProp<Record<string, object>, "GymData"> & {
    params: { gym: "arc" | "crce" };
  };
};

export const GymData: React.FC<GymDataProps> = ({ route }) => {
  const navigation =
    useNavigation<StackNavigationProp<GymStackParamList, "GymData">>();
  const { gym } = route.params;
  const [gymData, setGymData] = useState<DocumentData[]>([]);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [pressedSections, setPressedSections] = useState<
    Record<string, boolean>
  >({});
  const currentUserId = auth.currentUser?.uid;
  const openSections = gymData.filter((section) => section.isOpen);
  const closedSections = gymData.filter((section) => !section.isOpen);

  const formattedGymName =
    {
      arc: "ARC",
      crce: "CRCE",
    }[gym] || gym.toUpperCase();

  const fetchGymData = useCallback(() => {
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

  useEffect(() => {
    fetchGymData();
  }, [fetchGymData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGymData();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, [fetchGymData]);

  const handleFavoritePress = useCallback(
    (sectionDocID: string) => {
      const userDocRef = doc(collection(db, "users"), currentUserId);
      if (pressedSections[sectionDocID]) {
        updateDoc(userDocRef, { favorites: arrayRemove(sectionDocID) });
      } else {
        updateDoc(userDocRef, { favorites: arrayUnion(sectionDocID) });
      }
      setPressedSections((prev) => ({
        ...prev,
        [sectionDocID]: !prev[sectionDocID],
      }));
    },
    [pressedSections, currentUserId]
  );

  const renderGymSection = (sections: DocumentData[], sectionTitle: string) => (
    <View style={styles.sectionContainer}>
      <CustomText style={styles.sectionTitle}>
        {formattedGymName}'s {sectionTitle}
      </CustomText>
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
              name={
                pressedSections[section.key] ? "check-circle" : "add-circle"
              }
              size={24}
              color={pressedSections[section.key] ? "green" : "gray"}
              style={styles.iconButton}
              onPress={() => handleFavoritePress(section.key)}
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
            <CustomText>Closed</CustomText>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back"
            size={30}
            style={{ marginLeft: 10 }}
            color="white"
          />
        </TouchableOpacity>
        <CustomText style={styles.headerText}>See {formattedGymName} Info</CustomText>
      </View>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderGymSection(openSections, "Open Sections")}
        {renderGymSection(closedSections, "Closed Sections")}
      </ScrollView>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.midnightBlue,
  },
  scrollView: {
    marginTop: 40,
    flex: 1,
    width: "100%",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 0, // Ensure it starts from the very left
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 0, // Ensure no padding
    margin: 0, // Ensure no margin
    zIndex: 10, // Keep the header above all
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: Colors.midnightBlue,
  },

  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  gymContainer: {
    width: "90%",
    margin: 10,
    padding: 10,
    backgroundColor: Colors.subtleWhite,
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
  closedText: {
  color: "#FF6B6B",  // Red color for closed status
  fontSize: 18,
  fontWeight: "bold",
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 5,
  backgroundColor: "#f0f0f0", // Light grey background
}

});
