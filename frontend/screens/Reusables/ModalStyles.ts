import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.midnightBlue,
    },
    scrollView: {
      flex: 1,
      width: "100%",
    },
    contentContainer: {
      paddingBottom: 20, // Adjust this value as needed
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        // Other styling as needed
      },
    header: {
      position: "absolute",
      top: 0,
      left: 0, // Ensure it starts from the very left
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      padding: 0, // Ensure no padding
      margin: 0, // Ensure no margin
      zIndex: 10, // Keep the header above all
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      backgroundColor: Colors.midnightBlue,
    },
  
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
      marginLeft: 10,
    },
    gymContainer: {
      margin: 10,
      padding: 10,
      backgroundColor: Colors.subtleWhite,
      borderColor: Colors.subtleWhite,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 2,
    },
    progressBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "flex-start",
      marginHorizontal: 10,
    },
    addButton: {
      position: "absolute",
      top: 10,
      right: 10,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom:5
    },
    gymName: {
      fontSize: 20,
      fontWeight: "bold",
      marginLeft: 10,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconButton: {},
    sectionContainer: {
      width: "100%",
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      padding: 10,
    },
    lastUpdated: {
      fontSize: 16,
      color: "gray",
      alignSelf: "flex-start",
      marginBottom: 5,
      marginHorizontal: 10,
    },
    countCapacityText: {
      fontSize: 15,
    },
  
    unavailableText: {
      fontSize: 16,
      color: '#D9534F',
      textAlign: 'center',
    },
  });
  