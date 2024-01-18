
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Button, Keyboard, TouchableWithoutFeedback } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNewAccount, signOutUser } from "../../firebase/authConfig";

import Colors from "../../constants/Colors";
import { auth } from "../../firebase/firebaseConfig";
import CustomText from "../Reusables/CustomText";
import { getFirestore, collection, getDocs, writeBatch } from "firebase/firestore";
import { submitBugReport } from "../../firebase/firestore";
import { submitFeedback } from "../../firebase/firestore";

export const Settings = () => {
  const userId = auth.currentUser?.uid;
  const userEmail = auth.currentUser?.email;
  const [error, setError] = useState("");
  const [submissionType, setSubmissionType] = useState<'bug' | 'feedback' | null>(null);

  const [reportText, setReportText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');

  const handleReportSubmit = () => {
    if (reportText && submissionType) {
      if (submissionType === 'bug') {
        const reportData = {
          room: selectedRoom,
          report: reportText,
          timestamp: new Date() 
        };
        submitBugReport(reportData)
          .then(() => {
          })
          .catch((error) => {
            // console.error("Error submitting bug report:", error);
          });
      } else if (submissionType === 'feedback') {
        submitFeedback(reportText)
          .then(() => {
            // Handle success for feedback
          })
          .catch((error) => {
            // console.error("Error submitting feedback:", error);
          });
      }
  
      // Reset states
      setReportText('');
      setSelectedRoom('');
      setModalVisible(false);
      setSubmissionType(null);
    } else {
      // console.error("Incomplete report details");
    }
  };
  
  
  

  

  const clearUsersCollection = async () => {
    const db = getFirestore();
    const usersCollectionRef = collection(db, "users");
    const batch = writeBatch(db);
    createNewAccount();
    try {
      const snapshot = await getDocs(usersCollectionRef);
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
      // console.log("Users collection cleared");
    } catch (error) {
      // console.error("Error clearing users collection:", error);
    }
    signOutUser(setError);
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomText style={styles.text}>Reusable Settings</CustomText>
      {/* Just for demonstration, display the userId and userEmail */}
      <CustomText style={styles.infoText}>User ID: {userId}</CustomText>
      <TouchableOpacity
        onPress={clearUsersCollection}
        style={styles.signoutButton}
      >
        <CustomText style={styles.buttonText}>Clear All User Data</CustomText>


      </TouchableOpacity>


      <TouchableOpacity
  onPress={() => {
    setReportText('');
    setSubmissionType(null);
    setModalVisible(true);
  }}
  style={styles.signoutButton}
>
  <CustomText style={styles.buttonText}>Report Bug / Provide Feedback</CustomText>
</TouchableOpacity>

<Modal
  animationType="slide"
  transparent={false}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.centeredView}>
      {submissionType === null && (
        <>
          <Button title="Report Bug" onPress={() => setSubmissionType('bug')} />
          <Button title="Provide Feedback" onPress={() => setSubmissionType('feedback')} />
        </>
      )}
      {submissionType === 'bug' && selectedRoom === '' && (
        <>
          <Button title="Map" onPress={() => setSelectedRoom('Map')} />
          <Button title="Favorites" onPress={() => setSelectedRoom('Map')} />
          <Button title="Calender" onPress={() => setSelectedRoom('Map')} />
          <Button title="Other" onPress={() => setSelectedRoom('Other Room')} />
          {/* Add other room options as needed */}
        </>
      )}
      {submissionType === 'bug' && selectedRoom !== '' && (
        <>
          <TextInput
            style={styles.modalTextInput}
            onChangeText={setReportText}
            value={reportText}
            placeholder={`Describe the bug`}
            multiline
          />
          <Button title="Submit" onPress={handleReportSubmit} />
          <Button title="Cancel" onPress={() => {
            setModalVisible(false);
            setSelectedRoom('');
            setSubmissionType(null);
          }} />
        </>
      )}
      {submissionType === 'feedback' && (
        <>
          <TextInput
            style={styles.modalTextInput}
            onChangeText={setReportText}
            value={reportText}
            placeholder="Your feedback"
            multiline
          />
          <Button title="Submit" onPress={handleReportSubmit} />
          <Button title="Cancel" onPress={() => {
            setModalVisible(false);
            setSubmissionType(null);
          }} />
        </>
      )}
    </View>
  </TouchableWithoutFeedback>
</Modal>

      <View>
        <TouchableOpacity
          onPress={() => signOutUser(setError)}
          style={styles.signoutButton}
        >
          <CustomText style={styles.buttonText}>New Account</CustomText>
        </TouchableOpacity>
        <Text>{error}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.midnightBlue,
  },
  
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalTextInput: {
    height: 100,
    width: '80%', 
    margin: 20,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
    color: 'black',
    textAlignVertical: 'top', 
  },
  modalButton: {
    marginTop: 10,
    width: '60%', 
    padding: 10,
    elevation: 2,
  },
 
  infoText: {
    fontSize: 16,
    marginTop: 10,
  },
  signoutButton: {
    backgroundColor: Colors.uiucOrange,
    
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  dangerButton: {
  }
});

