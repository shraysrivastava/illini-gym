import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { GymData } from "./GymData";
import { GymSelection } from "./GymSelection";
import { GymInfo } from "./GymInfo";
export type GymStackParamList = {
  GymSelection: undefined;
  GymInfo: { gym: string };
  GymData: { gym: string };
};

const GymStack = createStackNavigator<GymStackParamList>();

export const GymMain = () => {
  return (
    <GymStack.Navigator
      initialRouteName="GymSelection"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <GymStack.Screen
        name="GymSelection"
        component={GymSelection}
        options={{ headerShown: false }}
      />
      <GymStack.Screen
        name="GymInfo"
        component={GymInfo} // you need to create this component
        options={{ headerShown: false }}
      />
      <GymStack.Screen
        name="GymData"
        component={GymData}
        options={{ headerShown: false }}
      />
    </GymStack.Navigator>
  );
};
