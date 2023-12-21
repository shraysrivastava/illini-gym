import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { User } from "firebase/auth";
import React from "react";
import Colors from "../constants/Colors";
// import { GymNav } from "./Gym/GymNav";
import { FavoritesNav } from "./Favorites/FavoritesNav";
import { CalendarNav } from "./Calendar/CalendarNav";
import { MapsNav } from "./Maps/MapsNav";


export type NavProps = {
  user: User;
  userData: any;
  fetchUserData: any;
  setUserData: any;
};

const Tab = createBottomTabNavigator();

export const BottomNav = (props: NavProps) => {
  const { user } = props;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: Colors.midnightBlue,
          },
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopColor: Colors.subtleWhite,
            borderTopWidth: 2,
          },
          tabBarActiveTintColor: Colors.uiucOrange,
          tabBarInactiveTintColor: Colors.gray,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen
          name="Favorites"
          component={FavoritesNav}
          options={({ navigation }) => ({
            // ...getCommonHeaderOptions(navigation, "Favorites"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="star" color={color} size={size} />
            ),
          })}
        />
        <Tab.Screen
          name="Maps"
          component={MapsNav}
          options={({ navigation }) => ({
            // ...getCommonHeaderOptions(navigation, "Calendar"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="map" color={color} size={size} />
            ),
          })}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarNav}
          options={({ navigation }) => ({
            // ...getCommonHeaderOptions(navigation, "Calendar"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="event" color={color} size={size} />
            ),
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
