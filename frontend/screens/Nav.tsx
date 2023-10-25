import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { User } from "firebase/auth";
import React from "react";
import { Favorites } from "./Favorites/Favorites";
import { Friends } from "./Friends/Friends";
import { Calendar} from "./Calendar/Calendar";
import { Profile } from "./Profile/Profile";
import Colors from "../constants/Colors";
import { GymMain } from "./Gym/GymMain";

export type NavProps = {
  user: User;
  userData: any;
  fetchUserData: any;
  setUserData: any;
};

const Tab = createBottomTabNavigator();

export const Nav = (props: NavProps) => {
  const { user } = props;

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Favorites"
          component={Favorites}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="view-dashboard"
                color={color}
                size={size}
              />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          }}
        />
        <Tab.Screen
          name="Friends"
          component={Friends}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-group"
                color={color}
                size={size}
              />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          }}
        />
        <Tab.Screen
          name="GymHome"
          component={GymMain}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="dumbbell"
                color={color}
                size={size}
              />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={Calendar}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="calendar"
                color={color}
                size={size}
              />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
