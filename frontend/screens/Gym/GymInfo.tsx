import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { GymStackParamList } from "./GymMain";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";  // Ensure you've installed @expo/vector-icons
import Colors from "../../constants/Colors";
import CustomText from "../Reusables/CustomText";
import { SafeAreaView } from "react-native-safe-area-context";
type GymInfoTypeRouteProp = RouteProp<GymStackParamList, 'GymInfo'>;

interface GymInfoTypeProps {
  route: GymInfoTypeRouteProp;
}

export const GymInfo: React.FC<GymInfoTypeProps> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<GymStackParamList, 'GymInfo'>>();

  const { gym } = route.params;

  // Utility to convert gym identifier to display-friendly name
  const formattedGymName = {
    arc: "ARC",
    crce: "CRCE"
  }[gym] || gym.toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <CustomText style={styles.headerText}>Select Different Gym</CustomText>
      </View>

      {/* Displaying the selected gym's name */}
      <CustomText style={styles.gymName}>{formattedGymName}</CustomText>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => {/* Navigate or show basic info */}}
      >
        <Text style={styles.buttonText}>Basic Info</Text>
      </TouchableOpacity>
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
      top: 50,
      left: 0, 
      flexDirection: "row",
      alignItems: "center",
      width: "100%", 
      padding: 0, 
      margin: 0, 
      zIndex: 10,
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
      shadowColor: '#000',
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
      fontWeight: "bold"
    },
    gymName: {
      fontSize: 30,
      fontWeight: 'bold',
      marginVertical: 20
    }
});
