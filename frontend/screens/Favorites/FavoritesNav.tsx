import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import Colors from "../../constants/Colors";
import { FavoriteSettings } from "../Settings/SettingsScreens/FavoriteSettings";
import { FavoritesScreen } from "./FavoritesScreen";
import { getCommonHeaderOptions } from "../CustomHeader";

export type FavoriteStackParamList = {
  FavoritesScreen: { isEditMode: boolean, action?: string };
  FavoriteSettings: undefined;
};

const FavoritesStack = createStackNavigator<FavoriteStackParamList>();

export const FavoritesNav = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const enableEditMode = (navigation: any ) => {
    setIsEditMode(true);
    navigation.setParams({ isEditMode: true, action: 'editModeOn' });
  };

  const renderHeaderLeft = (navigation: any) => 
  isEditMode ? (
    <TouchableOpacity
      onPress={() => {
        setIsEditMode(false);
        navigation.setParams({ isEditMode: false, action: 'cancel' });
      }}
      style={{ marginLeft: 10 }}
    >
      <MaterialIcons name="close" size={28} color="red" />
    </TouchableOpacity>
  ) : null;

  const renderHeaderRight = (navigation: any) => 
  isEditMode ? (
    <TouchableOpacity
    onPress={() => {
      setIsEditMode(false);
      navigation.setParams({ isEditMode: false, action: 'save' });
    }}
    style={{ marginRight: 10 }}
  >
      <MaterialIcons name="check" size={32} color="green" />
    </TouchableOpacity>
  ) : (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("FavoriteSettings")}
        style={{ marginRight: 10 }}
      >
        <MaterialIcons name="settings" size={32} color={Colors.uiucOrange} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => enableEditMode(navigation)}
        style={{ marginRight: 10 }}
      >
        <MaterialIcons name="edit" size={32} color={Colors.uiucOrange} />
      </TouchableOpacity>
    </View>
  );

  return (
    <FavoritesStack.Navigator
      initialRouteName="FavoritesScreen"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerShown: true,
        headerTintColor: "#fff",
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: Colors.midnightBlue },
      }}
    >
      <FavoritesStack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        initialParams={{ isEditMode: isEditMode }}
        options={({ navigation }) => ({
          headerLeft: () => renderHeaderLeft(navigation),
          headerRight: () => renderHeaderRight(navigation),
          headerTitle: "Favorites",
          headerTitleStyle: {
            fontSize: 20, 
          },
          
        })}
      />
      <FavoritesStack.Screen
        name="FavoriteSettings"
        component={FavoriteSettings}
        options={() => ({
          headerTitle: "Settings",
          headerTitleStyle: {
            fontSize: 20, 
          },
          
          
        })}
        
      />
    </FavoritesStack.Navigator>
  );
};
