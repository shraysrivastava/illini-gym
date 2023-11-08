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
import { View, TouchableOpacity } from 'react-native';

export type NavProps = {
  user: User;
  userData: any;
  fetchUserData: any;
  setUserData: any;
};

type CustomHeaderProps = {
  onProfilePress: () => void;
  onNotificationsPress: () => void;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ onProfilePress, onNotificationsPress }) => {
  const circleStyle = {
    width: 40,  // Or whatever size you desire
    height: 40,
    borderRadius: 20,  // This should be half of the width/height to make it a circle
    backgroundColor: 'white',  // Or any other background color you prefer
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  };
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10 }}>
      <TouchableOpacity style={{ marginRight: 15 }} onPress={onNotificationsPress} >
        <MaterialCommunityIcons name="bell" size={28} color={Colors.uiucOrange} />
      </TouchableOpacity>
      <TouchableOpacity style={{marginRight: 10}} onPress={onProfilePress}>
        <MaterialCommunityIcons name="account" size={28} color={Colors.uiucOrange} />
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
      onProfilePress={() => {
        navigation.navigate("Profile");
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
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
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
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-group" color={color} size={size} />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          })}
        />
        <Tab.Screen
          name="GymHome"
          component={GymMain}
          options={({ navigation }) => ({
            ...getCommonHeaderOptions(navigation),
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
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
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar" color={color} size={size} />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          })}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={({ navigation }) => ({
            ...getCommonHeaderOptions(navigation),
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
            tabBarActiveTintColor: Colors.uiucOrange,
            tabBarHideOnKeyboard: true,
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default CustomHeader;
