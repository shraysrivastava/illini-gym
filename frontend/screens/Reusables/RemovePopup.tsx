import React from "react";
import {View, Modal, TextInput, TouchableHighlight, Text, StyleSheet} from "react-native";
import Colors from "../../constants/Colors";

interface RemovePopupProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: (favoriteKey: string) => void;
  favoriteKey: string;
}

export const RemovePopup: React.FC<RemovePopupProps> = ({isVisible, onCancel, onConfirm, favoriteKey}) => {
    return (
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        // other modal props
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <Text style={styles.popupText}>
              Are you sure you want to remove this section from your favorites?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableHighlight
                style={styles.confirmButton}
                onPress={onCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.confirmButton}
                onPress={() => onConfirm(favoriteKey)}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
  // ... existing styles ...

  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker for better contrast
  },
  popupContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15, // More pronounced rounded corners
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold", // Optional: if you want to emphasize the text
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: Colors.uiucBlue, // Choose a color that stands out
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "stretch",
    shadowColor: Colors.uiucBlue, // Optional: shadow for the button
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  optionalText: {
    fontSize: 14, // Smaller font size
    color: "gray", // Lighter color
  },
  // ... other styles ...
});
