import React, { useState } from "react";
import ReusableInfo from "../ReusableInfo";
import ContactUs from "../ContactUs";
import { View, StyleSheet } from "react-native";
import CustomText  from "../../Reusables/CustomText";
import Colors from "../../../constants/Colors";

export const CalendarInfo = () => {
  return (
    <>
      <ContactUs />
      <View style={styles.footer}>
        <CustomText style={styles.disclaimer}>
          Data is provided by Campus Recreation staff and is meant to reflect usable space
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
