import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { db, auth } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import CustomText from '../Reusables/CustomText';
import FavoriteInstructions from '../Favorites/FavoritesInstructions';
import CustomToast, { ToastProps } from '../Reusables/Toast';

const InfoScreen = () => {
    const [userName, setUserName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState('');
    const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });
    const currentUserId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchUserName = async () => {
            if (currentUserId) {
                const userDocRef = doc(db, "users", currentUserId);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    setUserName(docSnap.data().username);
                }
            }
        };
        fetchUserName();
    }, [currentUserId]);

    const handleEdit = () => {
        setTempName(userName);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (currentUserId) {
            setToast({ message: "Username updated successfully", color: "green" });
            const userDocRef = doc(db, "users", currentUserId);
            await updateDoc(userDocRef, { username: tempName });
            setUserName(tempName);
        }
        setIsEditing(false);
    };
    return (
      <ScrollView style={styles.container}>
        {/* <CustomText style={styles.heading}>Using the App</CustomText> */}
        <CustomText style={styles.text}>
                Here’s a quick reminder on how to make the most of the app:
            </CustomText>
            {isEditing ? (
                <View style={styles.editContainer}>
                    <TextInput
                        style={styles.editNameInput}
                        value={tempName}
                        onChangeText={setTempName}
                        placeholder="Set Username (optional)"
                        placeholderTextColor="white"
                        autoFocus={true}
                        maxLength={15}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TouchableOpacity style={styles.nameDisplayContainer} onPress={handleEdit}>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameLabel}>Username: </Text>
                    <CustomText style={styles.userName}>
                        {userName || "Tap to set username"}
                    </CustomText>
                </View>
                <MaterialIcons name="edit" size={28} color={Colors.uiucOrange} />
            </TouchableOpacity>
            )}
        <FavoriteInstructions />
        <CustomText style={styles.disclaimer}>
          Note: Data is updated every 20 minutes by Campus Recreation staff. We
          strive for accuracy but are not responsible for any discrepancies.
        </CustomText>
        <CustomToast message={toast.message} color={toast.color} />
      </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.midnightBlue,
        padding: 15,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.uiucOrange,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.uiucOrange,
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 24, // Improves readability
    },
    disclaimer: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    editContainer: {
        marginVertical: 20,
        paddingHorizontal: 15,
    },
    editNameInput: {
        backgroundColor: "rgba(255, 255, 255, 0.3)", // Slightly more visibility
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        padding: 12,
        borderRadius: 8,
        borderBottomWidth: 2,
        borderBottomColor: Colors.uiucOrange,
    },
    nameDisplayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.uiucOrange,
        marginHorizontal: 15,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameLabel: {
        fontSize: 20,
        color: Colors.uiucOrange,
        marginRight: 8,
    },
    userName: {
        fontSize: 20,
        color: "white",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 8,
        width: '40%', // Uniform size
        alignItems: 'center', // Center text in button
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 8,
        width: '40%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default InfoScreen;
