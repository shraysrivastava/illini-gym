
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

import Colors from "../constants/Colors";
import { View, TouchableOpacity } from "react-native";
type CustomHeaderProps = {
  onSettingsPress: () => void;
  onInformationsPress: () => void;
  onMapsPress: () => void;
  title: string;
};

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  onSettingsPress,
  onInformationsPress,
  onMapsPress,
  title,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: 10,
      }}
    >
      {title === "ARC Section Data" && (
        <TouchableOpacity
        style={{ marginRight: 15 }}
        onPress={onMapsPress}
      >
        <MaterialIcons
          name="map"
          size={28}
          color={Colors.uiucOrange}
        />
      </TouchableOpacity>
      )}
      {title !== "View Arc Map" && title !== "Information" && (
        <TouchableOpacity
        style={{ marginRight: 15 }}
        onPress={onInformationsPress}
      >
        <MaterialIcons
          name="info-outline"
          size={28}
          color={Colors.uiucOrange}
        />
      </TouchableOpacity>
        )}
      
      {/* <TouchableOpacity style={{ marginRight: 10 }} onPress={onSettingsPress}>
        <MaterialIcons name="settings" size={28} color={Colors.uiucOrange} />
      </TouchableOpacity> */}
    </View>
  );
};

export const getCommonHeaderOptions = (navigation: any, stackName: string, title: string, gymName?:string) => ({
  headerShown: true,
  headerTitle: gymName || title,
  headerTitleStyle: {
    fontSize: 20, 
  },
  headerStyle: {
    backgroundColor: Colors.midnightBlue,
    shadowColor: "transparent",
    elevation: 0,
    borderBottomColor: Colors.subtleWhite,
    borderBottomWidth: 2,
  },
  headerRight: () => (
    <CustomHeader
      onSettingsPress={() => {
        if (stackName === "Favorites") {
          navigation.navigate("FavoriteSettings");
        } else if (stackName === "Gym") {
          navigation.navigate("GymSettings");
        } else if (stackName === "Calendar") {
          navigation.navigate("CalendarSettings");
        } else if (stackName === "Maps") {
          navigation.navigate("MapsSettings");
        } else {
          console.log("Settings icon pressed.");
        }
      }}
      onInformationsPress={() => {
        // This is where notification page goes
        if (stackName === "Favorites") {
          navigation.navigate("FavoritesInfo");
        }else if (stackName === "Calendar") {
          navigation.navigate("CalendarInfo");
        } else if (stackName === "Maps") {
          navigation.navigate("MapsInfo");
        } else {
          console.log("Settings icon pressed.");
        }
      }}
      onMapsPress={() => {
        navigation.navigate("MapsLargeMap");}
      }
      title={title}
    />
  ),
});
