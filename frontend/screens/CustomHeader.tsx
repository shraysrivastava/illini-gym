
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

import Colors from "../constants/Colors";
import { View, TouchableOpacity } from "react-native";
type CustomHeaderProps = {
  onSettingsPress: () => void;
  onNotificationsPress: () => void;
};

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  onSettingsPress,
  onNotificationsPress,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: 10,
      }}
    >
      <TouchableOpacity
        style={{ marginRight: 15 }}
        onPress={onNotificationsPress}
      >
        <MaterialIcons
          name="notifications"
          size={28}
          color={Colors.uiucOrange}
        />
      </TouchableOpacity>
      <TouchableOpacity style={{ marginRight: 10 }} onPress={onSettingsPress}>
        <MaterialIcons name="settings" size={28} color={Colors.uiucOrange} />
      </TouchableOpacity>
    </View>
  );
};

export const getCommonHeaderOptions = (navigation: any, stackName: string, title: string) => ({
  headerShown: true,
  headerTitle: title,
  headerStyle: {
    backgroundColor: Colors.midnightBlue,
    shadowColor: "transparent",
    elevation: 0,
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
        } else {
          console.log("Settings icon pressed.");
        }
      }}
      onNotificationsPress={() => {
        // This is where notification page goes
        console.log("Notifications icon pressed.");
      }}
    />
  ),
});
