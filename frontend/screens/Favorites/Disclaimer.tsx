import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import Colors from "../../constants/Colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type DisclaimerProps = {
    onPressHelp: () => void;
};

const Disclaimer: React.FC<DisclaimerProps> = ({ onPressHelp}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Illini</Text>
        <Image
          source={require("../../assets/illini-dumbbell.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Gym</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.mainText}>
          Data Display Temporarily Unavailable
        </Text>
        <Text style={styles.subText}>
          We regret to inform you that our data source has recently undergone
          changes, affecting our ability to display current information. Our
          team is actively developing an alternative solution to provide you
          with accurate and reliable data. We apologize for any inconvenience
          this may cause and appreciate your patience.
        </Text>
      </View>

      <TouchableOpacity onPress={onPressHelp} style={styles.helpTextWrapper}>
        <MaterialIcons name="help-outline" size={28} color="white" />
        <Text style={styles.helpText}>Need Help?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Updated to space-between
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 20, // Added padding to bottom
    paddingHorizontal: 20,
    backgroundColor: Colors.midnightBlue,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100, // Adjust size as needed
    height: 150, // Adjust size as needed
    // resizeMode: 'contain', // Ensure the logo scales correctly
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "white",
    textAlign: 'center',
    // Shadow properties for iOS
    shadowColor: "#BBBBBB", // Light gray shadow for subtle contrast
    shadowOffset: { width: 1, height: 2 }, // Slightly offset for depth
    shadowOpacity: 0.8, // Higher opacity for better visibility
    shadowRadius: 2, // A smaller radius for a more defined shadow
    // Text shadow for Android
    textShadowColor: 'rgba(187, 187, 187, 0.8)', // Light gray with opacity
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  
  
  content: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: Colors.subtleWhite, // Changed to white for contrast
    padding: 20, // Added padding
    borderRadius: 15, // Rounded corners
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: .5,
    borderColor: Colors.uiucOrange,
  },
  subText: {
    fontSize: 16, // Slightly smaller font size for subtlety
    color: Colors.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: 'normal', // Changed to normal for a lighter appearance
    marginTop: 15, // Added space above the subText
  },
  mainText: {
    fontSize: 24, // Adjusted for better proportion
    fontWeight: 'bold',
    color: "white",
    textAlign: 'center',
    marginBottom: 5,
  },
  favoritesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.uiucOrange,
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 20,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  favoritesText: {
    fontSize: 20,
    color: "white",
    textAlign: 'center',
    marginLeft: 10,
    fontWeight: '500', // Slightly bolder
  },
  helpTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.uiucBlue,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20, // More rounded corners
    shadowColor: "#000", // Adding shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  
  helpText: {
    fontSize: 20,
    color: "white",
    textAlign: 'center',
    marginLeft: 10,
    fontWeight: '500', // Slightly bolder
  },
});

export default Disclaimer;
