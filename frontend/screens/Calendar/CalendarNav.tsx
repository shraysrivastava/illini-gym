import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Colors from "../../constants/Colors";
import { CalendarSettings } from "../Settings/SettingsScreens/CalendarSettings";
import { getCommonHeaderOptions } from "../CustomHeader";
import { CalendarHome } from "./CalendarHome";
import { CalendarInfo } from "../Info/ReusableProfile/CalendarProfile";

export type CalendarStackParamList = {
  CalendarHome: undefined;
  CalendarSettings: undefined;
  CalendarInfo: undefined;
};

const CalendarStack = createStackNavigator<CalendarStackParamList>();

export const CalendarNav = () => {
  return (
    <CalendarStack.Navigator
      initialRouteName="CalendarHome"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerShown: false,
        headerTintColor: "#fff", // Color of header text and back button
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: Colors.midnightBlue,
        },
      }}
    >
      <CalendarStack.Screen
        name="CalendarHome"
        component={CalendarHome}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Calendar", "Calendar")
        }
      />
      <CalendarStack.Screen
        name="CalendarSettings"
        component={CalendarSettings}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Calendar", "Settings")
        }
      />
      <CalendarStack.Screen
        name="CalendarInfo"
        component={CalendarInfo}
        options={({ navigation }) =>
          getCommonHeaderOptions(navigation, "Calendar", "Information")
        }
      />
    </CalendarStack.Navigator>
  );
};
