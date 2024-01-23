import React from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
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

const FavoriteInstructions: React.FC = () => {
  return (
    <View style={styles.container}>
      <FadeInView style={styles.textBlock}>
        <Text style={styles.mainText}>Welcome to Illini Gym Tracker</Text>
        <Text style={styles.subText}>Discover and Train Smarter</Text>
      </FadeInView>
      
      <FadeInView style={styles.textBlock}>
        <Text style={styles.boldText}>Looking for a Gym?</Text>
        <Text style={styles.normalText}>Easily locate gyms nearby with a simple tap of the Map Icon.</Text>
      </FadeInView>

      <FadeInView style={styles.textBlock}>
        <Text style={styles.boldText}>Your Favorites, One Tap Away</Text>
        <Text style={styles.normalText}>Quickly access your favorite gym sections.</Text>
      </FadeInView>
      <FadeInView style={styles.textBlock}>
      <Text style={styles.boldText}>Need More Help?</Text>
      <Text style={styles.normalText}>Tap the information icon for further instructions.</Text>
      </FadeInView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.midnightBlue,
    justifyContent: 'center',
  },
  textBlock: {
    marginBottom: 30,
  },
  mainText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: "white",
    textAlign: 'center',
  },
  subText: {
    fontSize: 20,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 10,
  },
  boldText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.uiucOrange,
    marginBottom: 5,
  },
  normalText: {
    fontSize: 20,
    color: "white",
  },
});

export default FavoriteInstructions;
