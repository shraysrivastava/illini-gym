import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { User } from "firebase/auth";
import React from "react";
import { Favorites } from "./Favorites/Favorites";
import { Friends } from "./Friends/Friends";
import { Calendar} from "./Calendar/Calendar";
import {  Settings } from "./Settings/Settings";
import Colors from "../constants/Colors";
import { GymMain } from "./Gym/GymMain";
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export type NavProps = {
  user: User;
  userData: any;
  fetchUserData: any;
  setUserData: any;
};

type CustomHeaderProps = {
  onSettingsPress: () => void;
  onNotificationsPress: () => void;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ onSettingsPress, onNotificationsPress }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10 }}>
      <TouchableOpacity style={{ marginRight: 15 }} onPress={onNotificationsPress} >
        <MaterialIcons name="notifications" size={28} color={Colors.uiucOrange} />
      </TouchableOpacity>
      <TouchableOpacity style={{marginRight: 10}} onPress={onSettingsPress}>
        <MaterialIcons name="settings" size={28} color={Colors.uiucOrange} />
      </TouchableOpacity>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const getCommonHeaderOptions = (navigation: any) => ({
  headerShown: true,
  headerTitle: '',
  headerStyle: {
    backgroundColor: Colors.midnightBlue,
    shadowColor: 'transparent',
    elevation: 0,
  },
  headerRight: () => (
    <CustomHeader
    onSettingsPress={() => {
        navigation.navigate("Settings");
      }}
      onNotificationsPress={() => {
        // This is where notification page goes
        console.log("Notifications icon pressed.");
      }}
    />
  ),
});

export const Nav = (props: NavProps) => {
  const { user } = props;

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Favorites"
          component={Favorites}
          options={({ navigation }) => ({
            ...getCommonHeaderOptions(navigation),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="star" color={color} size={size} />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          })}
        />
        <Tab.Screen
          name="Friends"
          component={Friends}
          options={({ navigation }) => ({
            ...getCommonHeaderOptions(navigation),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="group" color={color} size={size} />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          })}
        />
        <Tab.Screen
          name="Gym"
          component={GymMain}
          options={({ navigation }) => ({
            ...getCommonHeaderOptions(navigation),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="fitness-center" color={color} size={size} />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          })}
        />
        <Tab.Screen
          name="Calendar"
          component={Calendar}
          options={({ navigation }) => ({
            ...getCommonHeaderOptions(navigation),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="event" color={color} size={size} />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          })}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={({ navigation }) => ({
            ...getCommonHeaderOptions(navigation),
            tabBarButton: () => null,
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default CustomHeader;
