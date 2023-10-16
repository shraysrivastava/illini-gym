import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { tabParamsList } from "./Nav"; // Ensure this is the correct path to your Nav.tsx
import Colors from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "./Reusables/CustomText";

type CalenderProps = {
  route: RouteProp<tabParamsList, "Calender">;
};

export const Calender = ({ route }: CalenderProps) => {
  const { userId, userEmail } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <CustomText style={styles.text}>Calender</CustomText>
      {/* Just for demonstration, display the userId and userEmail */}
      <CustomText style={styles.infoText}>User ID: {userId}</CustomText>
      <CustomText style={styles.infoText}>User Email: {userEmail}</CustomText>
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
});
