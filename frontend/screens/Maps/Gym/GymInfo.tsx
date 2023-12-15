import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import CustomText from "../../Reusables/CustomText";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapsStackParamList } from "../MapsNav";
import { Arc } from "./Arc";
import { Crce } from "./Crce";
type GymInfoTypeRouteProp = RouteProp<MapsStackParamList, "GymInfo">;

interface GymInfoTypeProps {
  route: GymInfoTypeRouteProp;
}

export const GymInfo: React.FC<GymInfoTypeProps> = ({ route }) => {
  const navigation =
    useNavigation<StackNavigationProp<MapsStackParamList, "GymInfo">>();

  const { gym } = route.params;

  // Utility to convert gym identifier to display-friendly name

  return (
    <SafeAreaView style={styles.container}>
      {/* Displaying the selected gym's name */}
      {gym == "arc" ? <Arc /> : <Crce />}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("GymData", { gym: gym })}
      >
        <Text style={styles.buttonText}>Data</Text>
      </TouchableOpacity>
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
  header: {
    position: "absolute",
    top: 0,
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
  gymName: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 20,
  },
});
