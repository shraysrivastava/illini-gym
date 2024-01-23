import WebView from 'react-native-webview';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../constants/Colors';

const DisplayForm: React.FC = () => {
    const websiteUrl = 'https://forms.gle/FSHQnMRwEiRJJrrQA'; // Replace with your desired URL

    return (
        <WebView 
            source={{ uri: websiteUrl }}
        />
    );
};



export default DisplayForm;
