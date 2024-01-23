// ContactUs.js
import React from 'react';
import { View, StyleSheet, Button, Linking, Text, TouchableOpacity, ScrollView, Image } from 'react-native'; // Import the Text component
import Colors from '../../constants/Colors';
import CustomText from '../Reusables/CustomText';

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
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Optional: Uncomment if you want to use the title */}
                {/* <Text style={styles.title}>Contact Us</Text> */}

                <TouchableOpacity style={styles.feedbackButton} onPress={openGoogleForm}>
                    {/* <Image 
                        source={require('../../assets/google-form.jpg')} // Replace with actual logo path
                        style={styles.logo}
                    /> */}
                    <Text style={styles.feedbackButtonText}>Feedback Form</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={sendEmail}>
                    <Text style={styles.buttonText}>Send Email</Text>
                </TouchableOpacity>
            </View>

            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.midnightBlue,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    feedbackButton: {
        backgroundColor: Colors.googleFormsPurple, // Define this color in your Colors file
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        elevation: 3,
        width: '80%',
    },
    feedbackButtonText: {
        color: "white",
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 10, // Space between logo and text
    },
    button: {
        backgroundColor: Colors.uiucOrange,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        elevation: 3,
        width: '80%', // Adjust width as needed
    },
    buttonText: {
        color: "white",
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
    logo: {
        width: 20, // Adjust as needed
        height: 20, // Adjust as needed
    },
});



export default ContactUs;
