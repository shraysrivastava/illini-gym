import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Colors from "../../constants/Colors";
import { FavoriteSettings } from "../Settings/FavoriteSettings";
import { getCommonHeaderOptions } from "../CustomHeader";
import { MapsHome } from "./MapsHome";
import { GymInfo } from "./GymInfo";
import { GymData } from "./GymData";
export type MapsStackParamList = {
  MapsHome: undefined;
  MapsSettings: undefined;
  GymInfo: { gym: string, gymName: string };
  GymData: { gym: string, gymName: string };
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
          getCommonHeaderOptions(navigation, "Maps", "Gym Info", route.params.gymName)
        }
      />
      <MapsStack.Screen
        name="GymData"
        component={GymData}
        options={({ navigation, route }) =>
          getCommonHeaderOptions(navigation, "Maps", route.params.gymName + " Section Data")
        }
      />
      <MapsStack.Screen
        name="MapsSettings"
        component={FavoriteSettings}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Maps", "Settings")
        }
      />
      


    </MapsStack.Navigator>
  );
};
