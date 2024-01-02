import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Colors from "../../constants/Colors";
import { FavoriteSettings } from "../Settings/SettingsScreens/FavoriteSettings";
import { getCommonHeaderOptions } from "../CustomHeader";
import { FavoritesScreen } from "./FavoritesScreen";
export type FavoriteStackParamList = {
  FavoritesHome: undefined;
  FavoriteSettings: undefined;
};

const FavoritesStack = createStackNavigator<FavoriteStackParamList>();

export const FavoritesNav = () => {
  return (
    <FavoritesStack.Navigator
      initialRouteName="FavoritesHome"
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
        name="FavoritesHome"
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
