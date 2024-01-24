import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Colors from "../../constants/Colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native-gesture-handler";


type FavoriteInstructionsProps = {
  onPress: () => void;
};

const FavoriteInstructions: React.FC<FavoriteInstructionsProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <View>
      <Text style={styles.mainText}>Welcome to Illini Gym</Text>
      <Text style={styles.subText}>Know Before You Go</Text>
      
      <Text style={styles.normalText}>📍 Explore the Map 📍</Text>
      <Text style={styles.normalText}>🔍 View Sections 🔍</Text>
      <Text style={styles.normalText}>⭐ Add to Favorites ⭐</Text>
      </View>
      
      <TouchableOpacity style={styles.helpTextWrapper} onPress={onPress}>
        <Text style={styles.helpText}>Need Help?  </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.midnightBlue,
  },
  mainText: {
    fontSize: 32,
    fontWeight: '600',
    color: "white",
    textAlign: 'center',
    marginBottom: 20,
  },
  subText: {
    fontSize: 20,
    color: Colors.uiucOrange,
    
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 45,
    fontWeight: 'bold',
  },

  normalText: {
    fontSize: 20,
    color: "white",
    textAlign: 'center',
    marginBottom: 20,
  },
  helpTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: Colors.uiucBlue,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    
  },
  helpText: {
    fontSize: 20,
    color: "white",
    textAlign: 'center',
    lineHeight: 24, // Adjust line height to align with the icon size
    paddingHorizontal: 0, // Optional: Add some horizontal padding if needed
  },
});

export default FavoriteInstructions;
