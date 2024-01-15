import React from "react";
import { View, Modal, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons'; // Assuming you're using Expo
import Colors from "../../constants/Colors";

interface SpecialHoursProps {
  isVisible: boolean;
  sectionName: string;
  onClose: () => void;
}

export const SpecialHours: React.FC<SpecialHoursProps> = ({ isVisible, sectionName, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.popupContainer} onStartShouldSetResponder={() => true}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.popupText}>
            Special Hours for {sectionName}
          </Text>
          <Text style={styles.hoursText}>
            {/* Replace with actual hours data */}
            Monday - Friday: 8:00 AM - 9:00 PM
            {"\n"}Saturday - Sunday: 10:00 AM - 8:00 PM
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative', // For the close button
  },
  popupText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "500",
    color: "black",
  },
  hoursText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  }
});

export default SpecialHours;
