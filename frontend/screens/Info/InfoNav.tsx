import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Colors from "../../constants/Colors";
import Information from "./Information";
import DisplayForm from "./DisplayForm";
import InfoInsructions from "./InfoInstructions";
export type InfoStackParamList = {
  Information: undefined;
  GoogleForm: undefined;
  Instructions: undefined;
};

const InfoStack = createStackNavigator<InfoStackParamList>();

export const InfoNav = () => {
  return (
    <InfoStack.Navigator
      initialRouteName="Information"
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
      <InfoStack.Screen
        name="Information"
        component={Information}
        options={() => ({
          headerTitle: "Information",
          headerTitleStyle: {
            fontSize: 20,
          },
        })}
      />
      <InfoStack.Screen
        name="GoogleForm"
        component={DisplayForm}
        options={() => ({
          headerTitle: "Feedback Form",
          headerTitleStyle: {
            fontSize: 20,
          },
        })}
      />
      <InfoStack.Screen
        name="Instructions"
        component={InfoInsructions}
        options={() => ({
          headerTitle: "Instructions",
          headerTitleStyle: {
            fontSize: 20,
          },
        })}
      />
    </InfoStack.Navigator>
  );
};
