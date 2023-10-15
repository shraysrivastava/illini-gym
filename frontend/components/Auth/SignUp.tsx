import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { signUpUser } from "../../firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import colors from "../../constants/Colors";
import CustomText from "../Reusables/CustomText";

type SignUpProps = {
  setHasAccount: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignUp = (props: SignUpProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedUserStatus, setSelectedUserStatus] = useState("");
  const [userStatusOptions, setUserStatusOptions] = useState([
    { label: "Freshman", value: "Freshman" },
    { label: "Sophomore", value: "Sophomore" },
    { label: "Junior", value: "Junior" },
    { label: "Senior", value: "Senior" },
    { label: "Graduate", value: "Graduate" },
    { label: "Faculty", value: "Faculty" },
  ]);

  const handleUserRegistration = () => {
    if (name === "") {
      setError("name cannot be empty");
    } else if (password !== confirmPassword) {
      setError("passwords do not match");
    } else if (selectedUserStatus === "") {
      setError("Please select Year");
    } else {
      signUpUser(name, email, password, selectedUserStatus, setError);
    }
  };

  return (
    <SafeAreaView style={styles.parentContainer}>
      <CustomText>Welcome!</CustomText>
      <TextInput
        style={styles.inputField}
        value={name}
        placeholder="Name"
        onChangeText={setName}
      />
      <TextInput
        style={styles.inputField}
        value={email}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.inputField}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.inputField}
        value={confirmPassword}
        placeholder="Confirm Password"
        secureTextEntry={true}
        onChangeText={setConfirmPassword}
      />

      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={isStatusDropdownOpen}
          value={selectedUserStatus}
          items={userStatusOptions}
          style={styles.statusDropdownStyle}
          setOpen={setIsStatusDropdownOpen}
          setValue={setSelectedUserStatus}
          setItems={setUserStatusOptions}
          placeholder="Select Illini Status"
          activityIndicatorColor="#5188E3"
        />
      </View>
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleUserRegistration}
      >
        <CustomText style={styles.signUpButtonText}>Sign Up</CustomText>
      </TouchableOpacity>
      <View style={styles.container}>
        <CustomText style={{color: "white"}}> Have an account? </CustomText>
        <CustomText
          style={styles.changeText}
          onPress={() => props.setHasAccount(true)}
        >
          Sign In
        </CustomText>
      </View>
      <CustomText style={styles.errorMessage}>{error}</CustomText>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 5,
  },
  dropdownContainer: {
    justifyContent: "center",
    marginBottom: 30,
    marginRight: 75,
    marginLeft: 75,
  },
  parentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.midnightBlue,
  },
  signUpText: {
    marginTop: 20,
    fontSize: 27,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  changeText: {
    color: colors.uiucOrange,
  },
  inputField: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: "lightgray",
    backgroundColor: "white",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  signUpButton: {
    width: 250,
    margin: 5,
    marginTop: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: colors.uiucOrange,
    borderRadius: 10,
  },
  signUpButtonText: {
    color: "white",
  },
  errorMessage: {
    textAlign: "center",
    color: "red",
  },
  statusDropdownStyle: {
    width: 250,
    height: 40,
    margin: 5,
    marginBottom: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    zIndex: 0,
  },
});

export default SignUp;
