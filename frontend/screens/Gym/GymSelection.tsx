import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GymStackParamList } from "./GymNav";
import { StackNavigationProp } from "@react-navigation/stack";
import Colors from "../../constants/Colors";

export const GymSelection = () => {
  const navigation =
    useNavigation<StackNavigationProp<GymStackParamList, "GymInfo">>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("GymInfo", { gym: "arc" })}
      >
        <Text style={styles.buttonText}>ARC</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("GymInfo", { gym: "crce" })}
      >
        <Text style={styles.buttonText}>CRCE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.midnightBlue,
  },
  button: {
    backgroundColor: Colors.uiucOrange,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
