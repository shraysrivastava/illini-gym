// ContactUs.js
import React from 'react';
import { View, StyleSheet, Button, Linking, Text, TouchableOpacity } from 'react-native'; // Import the Text component
import Colors from '../../constants/Colors';

const ContactUs = () => {
    const openGoogleForm = () => {
        const url = 'https://forms.gle/FSHQnMRwEiRJJrrQA';
        Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
    };

    const sendEmail = () => {
        const email = 'uiucillinigym@gmail.com';
        const subject = encodeURIComponent('Feedback/Query');
        const body = encodeURIComponent('Hi there,\n\nI wanted to share the following feedback/query:\n\n');
        const emailUrl = `mailto:${email}?subject=${subject}&body=${body}`;
        Linking.openURL(emailUrl).catch((err) => console.error("Couldn't open email client", err));
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contact Us</Text> 
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={openGoogleForm}>
                    <Text style={styles.buttonText}>Feedback Form</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={sendEmail}>
                    <Text style={styles.buttonText}>Email Us</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.uiucOrange,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        backgroundColor: Colors.uiucOrange, // Button color
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5, // Adjust as needed
    },
    buttonText: {
        color: "white", // Text color
        fontWeight: 'bold',
    },
});

export default ContactUs;
