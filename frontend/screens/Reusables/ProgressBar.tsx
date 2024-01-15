import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import Colors from "../../constants/Colors";

interface ProgressBarProps {
  count: number;
  capacity: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ count, capacity }) => {
    const clampedProgress = Math.max(0, Math.min(count / capacity, 1));
    const percentage = Math.round(clampedProgress * 100);
    let progressBarColor = '#4CAF50'; // Default to green
  
    if (percentage > 80) {
      progressBarColor = '#FF6B6B'; // Red for more than 80%
    } 
    else if (percentage > 60) {
      progressBarColor = '#FFA726'; // Orange for 50-80%
    }
  
    let textPosition;
    if (percentage >= 50) {
      textPosition = percentage / 2;
    } else if (percentage >= 30 && percentage < 50) {
      textPosition = percentage / 3;
    } else {
      textPosition = (100 + percentage) / 2;
    }
    

    return (
      <View style={styles.container}>
        <View style={[styles.progressBar]}>
          <View style={[styles.filledProgress, { width: `${percentage}%`, backgroundColor: progressBarColor }]}/>
          <CustomText style={[styles.progressText, { left: `${textPosition}%` }]}>
            {`${percentage}%`}
          </CustomText>
        </View>
        <CustomText style={styles.countCapacityText}>
          {count}/{capacity} People
        </CustomText>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      width: "55%",
      marginLeft: 5,
      marginTop: 5,
    },
    progressBar: {
      width: "100%",
      height: 20,
      flexDirection: "row",
      backgroundColor: Colors.subtleWhite, // Unfilled part
      borderRadius: 10,
      // borderColor: "white",
      // borderWidth: 0.5,
      overflow: "hidden", // Keeps nested views within the rounded border
    },
    filledProgress: {
      backgroundColor: "#4CAF50",
    },
    progressText: {
      fontWeight: 'bold',
      position: 'absolute',
      height: 20,
      lineHeight: 20, // Align text vertically
    },
    countCapacityText: {
      marginLeft: 5,
      color: 'gray',
      fontSize: 15,
    },
  });
  
  export default ProgressBar;
  
  
