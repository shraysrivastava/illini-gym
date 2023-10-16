import { StyleSheet, Text, View } from "react-native";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import { Auth } from "./screens/Auth/Auth";
import { useState } from "react";

import * as React from "react";
import { DocumentData } from "firebase/firestore";
import { fetchUserData } from "./firebase/firestore";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Nav} from "./screens/Nav";
export type tabParamsList = {
  Home: undefined;
  Profile: { user: User };
};
const Tab = createBottomTabNavigator<tabParamsList>();

export default function App() {
  const [user, setUser] = useState<User>();
  const [userData, setUserData] = useState<DocumentData>();

  onAuthStateChanged(auth, (user) => {
    if (user === null) {
      setUser(undefined);
    } else {
      setUser(user);
    }
  });

  if (user === undefined) {
    return (
      <View style={styles.container}>
        <Auth />
      </View>
    );
  } else {
    return (
      <Nav
        user={user}
        userData={userData}
        fetchUserData={fetchUserData}
        setUserData={setUserData}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
