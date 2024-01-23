import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Colors from "../../constants/Colors";
import { getCommonHeaderOptions } from "../CustomHeader";
import { MapsHome } from "./MapsHome";
import { GymInfo } from "./Gym/GymInfo";
import { GymData } from "./Gym/GymData";
import { MapsSettings } from "../Settings/SettingsScreens/MapsSettings";
import DisplayLargeMap from "../Reusables/DisplayLargeMap";
import { MapsInfo } from "../Info/InfoScreens/MapsInfo";
export type MapsStackParamList = {
  MapsHome: undefined;
  MapsSettings: undefined;
  GymInfo: { gym?: string; gymName?: string };
  GymData: { gym?: string; gymName?: string };
  MapsInfo: undefined;
  MapsLargeMap: undefined;
};

const MapsStack = createStackNavigator<MapsStackParamList>();

export const MapsNav = () => {
  return (
    <MapsStack.Navigator
      initialRouteName="MapsHome"
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
      <MapsStack.Screen
        name="MapsHome"
        component={MapsHome}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Maps", "Maps")
        }
      />
      <MapsStack.Screen
        name="GymInfo"
        component={GymInfo}
        options={({ navigation, route }) =>
          getCommonHeaderOptions(
            navigation,
            "Maps",
            "Gym Info",
            route.params.gymName
          )
        }
      />
      <MapsStack.Screen
        name="GymData"
        component={GymData}
        options={({ navigation, route }) =>
          getCommonHeaderOptions(navigation, "Maps", route.params.gymName ?? "")
        }
      />
      <MapsStack.Screen
        name="MapsSettings"
        component={MapsSettings}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Maps", "Settings")
        }
      />
      <MapsStack.Screen
        name="MapsInfo"
        component={MapsInfo}
        options={() => ({
          headerTitle: "Information",
          headerTitleStyle: {
            fontSize: 20,
          },
        })}
      />
      <MapsStack.Screen
        name="MapsLargeMap"
        component={DisplayLargeMap}
        options={() => ({
          headerTitle: "View ARC Map",
          headerTitleStyle: {
            fontSize: 20,
          },
        })}
      />
    </MapsStack.Navigator>
  );
};
