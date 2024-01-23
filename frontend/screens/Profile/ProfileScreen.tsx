import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { db, auth } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import CustomText from "../Reusables/CustomText";
// import FavoriteInstructions from '../Favorites/FavoritesInstructions';
import InfoInstructions from "./InfoInstructions";
import CustomToast, { ToastProps } from "../Reusables/Toast";
import ContactUs from "./ContactUs";

const ProfileScreen = () => {
  const [userName, setUserName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUserName = async () => {
      if (currentUserId) {
        const userDocRef = doc(db, "users", currentUserId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().username);
        }
      }
    };
    fetchUserName();
  }, [currentUserId]);

  const handleEdit = () => {
    setTempName(userName);
    setIsEditing(true);
  };

  const handleCancel = () => {
    // setToast({ message: "Username not updated", color: "red" });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (currentUserId) {
      if (tempName !== "") {
        setToast({ message: "Username updated successfully", color: "green" });
      }
      const userDocRef = doc(db, "users", currentUserId);
      await updateDoc(userDocRef, { username: tempName });
      setUserName(tempName);
    }
    setIsEditing(false);
  };
  return (
    <ScrollView style={styles.container}>
      {/* <CustomText style={styles.text}>
        Maximize your gym visits with these helpful tips:
      </CustomText> */}

      {/* {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editNameInput}
            value={tempName}
            onChangeText={setTempName}
            placeholder=" Enter Username (optional)"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            autoFocus={true}
            maxLength={15}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.nameDisplayContainer}
          onPress={handleEdit}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.nameLabel}>Username: </Text>
            <CustomText style={styles.userName}>
              {userName || "Tap to set"}
            </CustomText>
          </View>
          
        </TouchableOpacity>
      )} */}

      <ContactUs />

      {/* <CustomText style={styles.disclaimer}>
        Data is provided by Campus Recreation staff and reflects usable space
        occupancy, not maximum capacity. Accuracy depends on timely updates from
        staff.
      </CustomText> */}

      <CustomToast message={toast.message} color={toast.color} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnightBlue,
    padding: 15,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.uiucOrange,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.uiucOrange,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 24, // Improves readability
  },
  disclaimer: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 20,
    fontStyle: "italic",
  },
  editContainer: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  editNameInput: {
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Slightly more visibility
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    padding: 12,
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: Colors.uiucOrange,
  },
  nameDisplayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.uiucOrange,
    marginHorizontal: 15,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameLabel: {
    fontSize: 20,
    color: Colors.uiucOrange,
    marginRight: 8,
  },
  userName: {
    fontSize: 20,
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    width: "40%", // Uniform size
    alignItems: "center", // Center text in button
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  editPrompt: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
});

export default ProfileScreen;
