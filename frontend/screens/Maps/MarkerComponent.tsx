import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
const MarkerComponent = ({ marker, onPress, isSelected }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.markerContainer}>
        <Text
          style={[
            styles.markerTitle,
            { bottom: isSelected ? 42 : 30 },
          ]}
        >
          {marker.title}
        </Text>
        <MaterialIcons
          name="place"
          size={isSelected ? 45 : 32}
          color={Colors.uiucOrange}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    markerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    markerTitle: {
      color: Colors.midnightBlue,
      fontWeight: 'bold',
      position: 'absolute',
      textAlign: 'center',
      width: 100,
      flexShrink: 1,
      zIndex: 1,
    },
  });
  
export default MarkerComponent;
