import React from "react";
import { View, StyleSheet, Animated, Text, Image } from "react-native";
import Colors from "../../constants/Colors";

const FadeInView = (props) => {
  const fadeAnim = new Animated.Value(0); // Initial opacity of 0

  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const FadeInText = ({ style, children }) => {
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.Text style={{ ...style, opacity: fadeAnim }}>
      {children}
    </Animated.Text>
  );
};

const FavoriteInstructions: React.FC = () => {
  return (
    <FadeInView style={styles.container}>
      <FadeInText style={styles.mainText}>Welcome to Illini Gym</FadeInText>
      
      <FadeInText style={styles.subText}>Avoid the Crowd</FadeInText>
      <FadeInText style={styles.subText}>Train Smarter</FadeInText>

      <View style={styles.instructionBlock}>
        <FadeInText style={styles.boldText}>1. Explore The Map</FadeInText>
        <FadeInText style={styles.boldText}>2. Add to Favorites</FadeInText>
        <FadeInText style={styles.normalText}>
          Come back here to monitor your newly added favorited sections
        </FadeInText>
      </View>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.midnightBlue, // Your existing dark blue background
    justifyContent: 'flex-start',
  },
  instructionBlock: {
    marginTop: 20,
    marginBottom: 35,
    alignItems: 'center',
  },
  mainText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.uiucOrange, // Bright color for contrast
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 20,
    textShadowColor: Colors.uiucBlue, // Subtle white shadow for depth
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subText: {
    fontSize: 22,
    color: Colors.gray, // Light gray for visibility
    textAlign: 'center',
    marginBottom: 5,
  },
  boldText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.uiucOrange, // Same bright color for consistency
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.5)', // White shadow for emphasis
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  normalText: {
    fontSize: 20,
    color: "white", // White for clear visibility
    textAlign: 'center',
    lineHeight: 24,
  },
  // Optional icon style
  iconStyle: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
});



export default FavoriteInstructions;