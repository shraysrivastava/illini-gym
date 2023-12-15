import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    defaultText: {
        color: '#FFFFFF',
    },
});

const CustomText = (props) => {
    return <Text {...props} style={[styles.defaultText, props.style]}>{props.children}</Text>;
};

export default CustomText;