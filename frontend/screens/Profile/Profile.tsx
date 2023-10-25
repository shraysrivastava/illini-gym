import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
<<<<<<< HEAD:frontend/components/Profile.tsx
import { signOutUser } from "../firebase/auth";
import CustomText from "./Reusables/CustomText";
import colors from "../constants/Colors";
type ProfileProps = {
  route: RouteProp<tabParamsList, "Profile">;
};
=======
import { signOutUser } from "../../firebase/auth";
import CustomText from "../Reusables/CustomText";
import Colors from "../../constants/Colors";
import { auth } from "../../firebase/firebaseConfig";

>>>>>>> 71af7e4f0ccbbc69b42fabe34f8043f93bee928a:frontend/screens/Profile/Profile.tsx

export const Profile = () => {
  const userId = auth.currentUser?.uid;
  const userEmail = auth.currentUser?.email;
  const [error, setError] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <CustomText style={styles.text}>Profile</CustomText>
      {/* Just for demonstration, display the userId and userEmail */}
      <CustomText style={styles.infoText}>User ID: {userId}</CustomText>
      <CustomText style={styles.infoText}>User Email: {userEmail}</CustomText>

      <View>
        <TouchableOpacity
          onPress={() => signOutUser(setError)}
          style={styles.signoutButton}
        >
          <CustomText>Sign Out</CustomText>
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
});
