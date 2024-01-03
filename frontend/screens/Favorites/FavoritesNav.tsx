import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Colors from "../../constants/Colors";
import { FavoriteSettings } from "../Settings/SettingsScreens/FavoriteSettings";
import { getCommonHeaderOptions } from "../CustomHeader";
import { FavoritesScreen } from "./FavoritesScreen";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export type FavoriteStackParamList = {
  FavoritesScreen: undefined;
  FavoriteSettings: undefined;
};

const FavoritesStack = createStackNavigator<FavoriteStackParamList>();


export const FavoritesNav = () => {
  return (
    <FavoritesStack.Navigator
      initialRouteName="FavoritesScreen"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerShown: true,
        headerTintColor: "#fff", // Color of header text and back button
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: Colors.midnightBlue,
        },
      }}
    >
      <FavoritesStack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Favorites", "Favorites")
        }
      />
      <FavoritesStack.Screen
        name="FavoriteSettings"
        component={FavoriteSettings}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Favorites", "Settings")
        }
      />
    </FavoritesStack.Navigator>
  );
};
