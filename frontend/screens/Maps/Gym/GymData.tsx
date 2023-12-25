import React, { useState, useEffect, useCallback } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { ScrollView, View, RefreshControl, Modal, TextInput, Button, TouchableHighlight, Text, StyleSheet } from "react-native";
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
  deleteField,
} from "firebase/firestore";
import { styles } from "../../Reusables/ModalStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MapsStackParamList } from "../MapsNav";
import { SectionModals } from "./SectionModal";
import CustomText from "../../Reusables/CustomText";
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
  const [pressedSections, setPressedSections] = useState<Record<string, boolean>>({});
  const currentUserId = auth.currentUser?.uid;
  const openSections = gymData.filter((section) => section.isOpen);
  const closedSections = gymData.filter((section) => !section.isOpen);
  const [isNicknamePromptVisible, setIsNicknamePromptVisible] = useState<boolean>(false);
  const [currentSectionForNickname, setCurrentSectionForNickname] = useState<string | null>(null);
  const [nicknameInput, setNicknameInput] = useState<string>("");

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
        // console.log(favorites);
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
      const favoriteKey = gym + "=" + sectionDocID;
  
      if (pressedSections[sectionDocID]) {
        // Remove from favorites
        updateDoc(userDocRef, { favorites: arrayRemove(favoriteKey) }).then(() => {
          // Also remove the nickname associated with this section
          updateDoc(userDocRef, {
            [`nicknames.${favoriteKey}`]: deleteField(),
          });
        });

      } else {
        // Add to favorites and prompt for nickname
        updateDoc(userDocRef, { favorites: arrayUnion(favoriteKey) });
        setCurrentSectionForNickname(sectionDocID);
        setIsNicknamePromptVisible(true);
      }
  
      setPressedSections((prev) => ({
        ...prev,
        [sectionDocID]: !prev[sectionDocID],
      }));
    },
    [pressedSections, currentUserId]
  );

  const handleNicknameSubmit = useCallback(async () => {
    if (currentSectionForNickname && nicknameInput) {
      const userDocRef = doc(collection(db, "users"), currentUserId);
      const nicknameKey = `${gym}=${currentSectionForNickname}`;
  
      // Get the current nicknames
      const userDoc = await getDoc(userDocRef);
      const currentNicknames = userDoc.data()?.nicknames;
  
      // Update the user's document with the new nickname
      updateDoc(userDocRef, {
        nicknames: {
          ...currentNicknames,
          [nicknameKey]: nicknameInput,
        },
      });
    }
  
    // Reset states
    setIsNicknamePromptVisible(false);
    setNicknameInput("");
  }, [currentSectionForNickname, nicknameInput, currentUserId, gym]);
  
  const NicknamePopupModal = () => {  
    return (
      <Modal
          visible={isNicknamePromptVisible}
          animationType="slide"
          transparent={true}
          // other modal props
        >
          <View style={localStyles.nicknameModalContainer}>
            <View style={localStyles.nicknameModalContent}>
              <Text style={localStyles.nicknameModalText}>
                Set a nickname{" "}
                <Text style={localStyles.optionalText}>(optional)</Text>:
              </Text>
              <TextInput
                style={localStyles.nicknameTextInput}
                value={nicknameInput}
                onChangeText={setNicknameInput}
                placeholder="Nickname (leave blank to skip)"
                placeholderTextColor={"gray"}
                maxLength={20}
                // other text input props
              />

              <TouchableHighlight
                style={localStyles.continueButton}
                onPress={handleNicknameSubmit}
              >
                <Text style={localStyles.nicknameButtonText}>Continue</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
    )
  };

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
      {isNicknamePromptVisible && (
        <NicknamePopupModal />
      )}
    </View>
  );
};


const localStyles = StyleSheet.create({
  // ... existing styles ...

  nicknameModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker for better contrast
  },
  nicknameModalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15, // More pronounced rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nicknameModalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold', // Optional: if you want to emphasize the text
  },
  nicknameTextInput: {
    height: 40,
    borderColor: '#ccc', // Softer border color
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5, // Rounded corners for the input field
  },
  continueButton: {
    backgroundColor: Colors.uiucBlue, // Choose a color that stands out
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'stretch',
    shadowColor: Colors.uiucBlue, // Optional: shadow for the button
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  nicknameButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  optionalText: {
    fontSize: 14, // Smaller font size
    color: "gray", // Lighter color
  },
  // ... other styles ...
});

