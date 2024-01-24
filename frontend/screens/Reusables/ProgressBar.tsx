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
  let progressBarColor = '#4CAF50'; // Green by default

  if (percentage > 70) {
    progressBarColor = '#FF6B6B'; // Red for 70-100
  } else if (percentage > 40) {
    progressBarColor = '#FFA726'; // Orange for 40-70
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.filledProgress, { width: `${percentage}%`, backgroundColor: progressBarColor }]}>
          {/* <CustomText style={styles.progressText}>
            {`${percentage}%`}
          </CustomText> */}
        </View>
        
          <CustomText style={[styles.progressText, styles.unfilledProgressText]}>
            {`${percentage}%`}
          </CustomText>
        
      </View>
      <CustomText style={styles.countCapacityText}>
        {count}/{capacity} people
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginLeft: 5,
    marginTop: 5,
  },
  progressBar: {
    width: "100%",
    height: 20,
    flexDirection: "row",
    backgroundColor: Colors.subtleWhite,
    borderRadius: 10,
    overflow: "hidden",
  },
  filledProgress: {
    justifyContent: "center", // Center text vertically
    alignItems: "flex-end", // Align text to the right
  },
  progressText: {
    fontWeight: 'bold',
    color: 'white', // Ensuring text is visible on colored background
  },
  unfilledProgressText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center', // Center text horizontally
    color: 'white', // Text color for unfilled section
  },
  countCapacityText: {
    marginLeft: 5,
    color: 'gray',
    fontSize: 13,
  },
});

export default ProgressBar;
