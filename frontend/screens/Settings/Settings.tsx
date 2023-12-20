import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNewAccount } from "../../firebase/authConfig";

import Colors from "../../constants/Colors";
import { auth } from "../../firebase/firebaseConfig";
import CustomText from "../Reusables/CustomText";
import { getFirestore, collection, getDocs, writeBatch } from "firebase/firestore";


export const Settings = () => {
  const userId = auth.currentUser?.uid;
  const userEmail = auth.currentUser?.email;
  const [error, setError] = useState("");

  const clearUsersCollection = async () => {
    const db = getFirestore();
    const usersCollectionRef = collection(db, "users");
    const batch = writeBatch(db);
    createNewAccount();
    try {
      const snapshot = await getDocs(usersCollectionRef);
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
      console.log("Users collection cleared");
    } catch (error) {
      console.error("Error clearing users collection:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomText style={styles.text}>Reusable Settings</CustomText>
      {/* Just for demonstration, display the userId and userEmail */}
      <CustomText style={styles.infoText}>User ID: {userId}</CustomText>
      <TouchableOpacity
        onPress={clearUsersCollection}
        style={styles.signoutButton}
      >
        <CustomText style={styles.buttonText}>Clear All User Data</CustomText>
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          onPress={() => createNewAccount()}
          style={styles.signoutButton}
        >
          <CustomText style={styles.buttonText}>New Account</CustomText>
        </TouchableOpacity>
        <Text>{error}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.midnightBlue,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    marginTop: 10,
  },
  signoutButton: {
    backgroundColor: Colors.uiucOrange,
    
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  dangerButton: {
  }
});
