import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import Colors from "../../constants/Colors";
import { FavoriteSettings } from "../Settings/SettingsScreens/FavoriteSettings";
import { FavoritesScreen } from "./FavoritesScreen";
import { getCommonHeaderOptions } from "../CustomHeader";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import DisplayLargeMap from "../Reusables/DisplayLargeMap";

export type FavoriteStackParamList = {
  FavoritesScreen: { isEditMode: boolean, action: string};
  FavoriteSettings: undefined;
  DisplayLargeMap: undefined;
};

const FavoritesStack = createStackNavigator<FavoriteStackParamList>();

export const FavoritesNav = () => {
  const route = useRoute<RouteProp<FavoriteStackParamList, 'FavoritesScreen'>>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Favorites");

  useEffect(() => {
    if (isEditMode) {
      setTitle("Edit Favorites");
    } else {
      setTitle("Favorites");
    }
  }, [isEditMode]);
  
  const enableEditMode = (navigation: any ) => {
    setIsEditMode(true);
    // setTitle("Edit Favorites");
    navigation.setParams({ isEditMode: true, action: 'editModeOn'});
  };

  const renderHeaderLeft = (navigation: any) =>
    isEditMode ? (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            setTimeout(() => {
              setIsEditMode(false);
              navigation.setParams({ isEditMode: false, action: "cancel" });
            }, 100); // Delay to allow local nickname state to update
          }}
          style={{ marginLeft: 10 }}
        >
          <MaterialIcons name="close" size={28} color="red" />
        </TouchableOpacity>
      </View>
    ) : (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("FavoriteSettings")}
          style={{ marginLeft: 10 }}
        >
          <MaterialIcons name="settings" size={32} color={Colors.uiucOrange} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("DisplayLargeMap")}
          style={{ marginLeft: 10 }}
        >
          <MaterialIcons name="map" size={32} color={Colors.uiucOrange} />
        </TouchableOpacity>
      </View>
    );

  const renderHeaderRight = (navigation: any) =>
    isEditMode ? (
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          setTimeout(() => {
            setIsEditMode(false);
            // setTitle("Favorites");
            navigation.setParams({ isEditMode: false, action: "save" });
          }, 100); // Delay to allow local nickname state to update
        }}
        style={{ marginRight: 10 }}
      >
        <MaterialIcons name="check" size={32} color="green" />
      </TouchableOpacity>
    ) : (
      <View style={{ flexDirection: "row" }}>
        
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
        initialParams={{ isEditMode: isEditMode}}
        options={({ navigation }) => ({
          headerLeft: () => renderHeaderLeft(navigation),
          headerRight: () => renderHeaderRight(navigation),
          headerTitle: title,
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
      <FavoritesStack.Screen
        name="DisplayLargeMap"
        component={DisplayLargeMap}
        options={() => ({
          headerTitle: "View Arc map",
          headerTitleStyle: {
            fontSize: 20, 
          },
        })}
        
      />
      
    </FavoritesStack.Navigator>
  );
};
