import WebView from 'react-native-webview';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../constants/Colors';

const DisplayLargeMap: React.FC = () => {
    const websiteUrl = 'https://campusrec.illinois.edu/facilities/arc/map'; // Replace with your desired URL

    return (
        <WebView 
            source={{ uri: websiteUrl }}
        />
    );
};

const styles = StyleSheet.create({
});

export default DisplayLargeMap;
