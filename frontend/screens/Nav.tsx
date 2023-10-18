import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { User } from "firebase/auth";
import React from "react";
import { Favorites } from "./Favorites";
import { Friends } from "./Friends";
import { Gym } from "./Gym";
import { Calender } from "./Calender";
import { Profile } from "./Profile";
import Colors from "../constants/Colors";

export type tabParamsList = {
  Favorites: { userId: string; userEmail: string };
    Friends: { userId: string; userEmail: string };
    Gym: { userId: string; userEmail: string };
    Calender: { userId: string; userEmail: string };
    Profile: { userId: string; userEmail: string };

  };

export type NavProps = {
  user: User;
  userData: any;
  fetchUserData: any;
  setUserData: any;
};

const Tab = createBottomTabNavigator<tabParamsList>();

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
                <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
              ),
              tabBarActiveTintColor: Colors.uiucOrange,
              tabBarHideOnKeyboard: true,
            }}
            initialParams={{ userId: user.uid, userEmail: user.email ?? '' }}
          />
          <Tab.Screen
            name="Friends"
            component={Friends}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account-group" color={color} size={size} />
              ),
              tabBarActiveTintColor: Colors.uiucOrange,
              tabBarHideOnKeyboard: true,
            }}
            initialParams={{ userId: user.uid, userEmail: user.email ?? '' }}
          />
          <Tab.Screen
            name="Gym"
            component={Gym}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
              ),
              tabBarActiveTintColor: Colors.uiucOrange,
              tabBarHideOnKeyboard: true,
            }}
            initialParams={{ userId: user.uid, userEmail: user.email ?? '' }}
          />
          <Tab.Screen
            name="Calender"
            component={Calender}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="calendar" color={color} size={size} />
              ),
              tabBarActiveTintColor: Colors.uiucOrange,
              tabBarHideOnKeyboard: true,
            }}
            initialParams={{ userId: user.uid, userEmail: user.email ?? '' }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" color={color} size={size} />
              ),
              tabBarActiveTintColor: Colors.uiucOrange,
              tabBarHideOnKeyboard: true,
            }}
            initialParams={{ userId: user.uid, userEmail: user.email ?? '' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  };