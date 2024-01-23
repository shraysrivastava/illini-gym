import React, { useState } from "react";
import ContactUs from "../ContactUs";
import { View, StyleSheet } from "react-native";
import CustomText  from "../../Reusables/CustomText";
import Colors from "../../../constants/Colors";

export const FavoritesInfo = () => {
  return (
    <>
      <ContactUs />
      <View style={styles.footer}>
        <CustomText style={styles.disclaimer}>
          Data is provided by Campus Recreation staff and reflects usable space
          occupancy, not maximum capacity. Accuracy depends on timely updates
          from staff.
        </CustomText>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    backgroundColor: Colors.midnightBlue,
},
disclaimer: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    fontStyle: "italic",
},
});
