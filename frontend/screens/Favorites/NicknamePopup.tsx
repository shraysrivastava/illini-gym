import React from "react";
import {View, Modal, TextInput, TouchableHighlight, Text, StyleSheet} from "react-native";
import Colors from "../../constants/Colors";

interface NicknamePopupProps {
  isVisible: boolean;
  onSubmit: () => void;
  onChangeText: (text: string) => void;
  inputValue: string;
}

export const NicknamePopup: React.FC<NicknamePopupProps> = ({
  isVisible,
  onSubmit,
  onChangeText,
  inputValue,
}) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      // other modal props
    >
      <View style={styles.nicknameModalContainer}>
        <View style={styles.nicknameModalContent}>
          <Text style={styles.nicknameModalText}>
            Set a nickname{" "}
            <Text style={styles.optionalText}>(optional)</Text>:
          </Text>
          <TextInput
            style={styles.nicknameTextInput}
            value={inputValue}
            onChangeText={onChangeText}
            placeholder="Nickname (leave blank to skip)"
            placeholderTextColor={"gray"}
            maxLength={20}
            // other text input props
          />

          <TouchableHighlight
            style={styles.continueButton}
            onPress={onSubmit}
          >
            <Text style={styles.nicknameButtonText}>Continue</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...

  nicknameModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker for better contrast
  },
  nicknameModalContent: {
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
  nicknameModalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold", // Optional: if you want to emphasize the text
  },
  nicknameTextInput: {
    height: 40,
    borderColor: "#ccc", // Softer border color
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5, // Rounded corners for the input field
  },
  continueButton: {
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
  nicknameButtonText: {
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
