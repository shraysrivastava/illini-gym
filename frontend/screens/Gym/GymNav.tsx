import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { GymData } from "./GymData";
import { GymSelection } from "./GymSelection";
import { GymInfo } from "./GymInfo";
import Colors from "../../constants/Colors";
import { GymSettings } from "../Settings/GymSettings";
import { getCommonHeaderOptions } from "../CustomHeader";
export type GymStackParamList = {
  GymSelection: undefined;
  GymInfo: { gym: string };
  GymData: { gym: string };
  GymSettings: undefined;
};

const GymStack = createStackNavigator<GymStackParamList>();

export const GymNav = () => {
  return (
    <GymStack.Navigator
      initialRouteName="GymSelection"
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
      <GymStack.Screen
        name="GymSelection"
        component={GymSelection}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Gym", "Select a Gym")
        }
      />
      <GymStack.Screen
        name="GymInfo"
        component={GymInfo}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Gym", "Gym Info")
        }
      />
      <GymStack.Screen
        name="GymData"
        component={GymData}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Gym", "Gym Data")
        }
      />
      <GymStack.Screen
        name="GymSettings"
        component={GymSettings}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Gym", "Settings")
        }
      />
    </GymStack.Navigator>
  );
};
