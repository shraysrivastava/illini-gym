import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Button, Modal, Animated, Dimensions} from 'react-native';
import MapView, { Marker, Polyline, Circle, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { gymMarkers } from './GymMarkers';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MapsStackParamList } from './MapsNav';
import Colors from '../../constants/Colors';
import { TouchableWithoutFeedback } from 'react-native';

const INITIAL_REGION = {
  latitude: 40.10385157161382,
  longitude: -88.23056902208337,
  latitudeDelta: 0.03,
  longitudeDelta: 0.01,
};

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface MarkerData {
  key: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const MapsHome: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MapsStackParamList, 'GymInfo'>>();
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGym, setSelectedGym] = useState<MarkerData | null>(null);
  const mapRef = useRef<MapView>(null);

  const handleMarkerPress = (marker: MarkerData) => {
    setSelectedGym(marker);
    setModalVisible(true);
  };
  
  const navigateToGymData = () => {
    if (selectedGym) {
      const gym = selectedGym.key === '1' ? 'arc' : 'crce';
      navigation.navigate('GymData', { gym: gym, gymName: gym.toUpperCase() });
      setModalVisible(false);
    }
  };
  
  const navigateToGymInfo = () => {
    if (selectedGym) {
      navigation.navigate('GymInfo', { gym: selectedGym.key, gymName: selectedGym.title });
      setModalVisible(false);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const resetMapToInitialRegion = () => {
    mapRef.current?.animateToRegion(INITIAL_REGION, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
      >
        {gymMarkers.map((marker: MarkerData) => (
          <Marker
            key={marker.key}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => handleMarkerPress(marker)}
          >
            <Text style={styles.markerTitle}>{marker.title}</Text>
            <TouchableOpacity onPress={() => handleMarkerPress(marker)}>
              <MaterialIcons name="place" size={32} color={Colors.uiucOrange} />
            </TouchableOpacity>
          </Marker>
        ))}

        {currentLocation && (
          <Circle
            center={currentLocation}
            radius={1000}
            fillColor="rgba(255, 0, 0, 0.2)"
            strokeColor="rgba(255, 0, 0, 0.2)"
          />
        )}
      </MapView>
      <TouchableOpacity style={styles.recenterButton} onPress={resetMapToInitialRegion}>
        <MaterialIcons name="my-location" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.fullScreenButton}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={navigateToGymInfo}
                  >
                    <Text style={styles.buttonText}>Basic Info</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={navigateToGymData}
                  >
                    <Text style={styles.buttonText}>Gym Data</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerTitleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
    padding: 5,
    borderRadius: 5,
    marginBottom: 5, // Spacing between title and icon
    alignItems: 'center', // Center align the text
  },
  markerTitle: {
    color: Colors.black, // Text color
    fontWeight: 'bold', // Bold text
    // You can add other styling like fontSize, etc.
  },
  recenterButton: {
    position: 'absolute',
    top: 10, // Changed from top to bottom
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(52, 52, 52, 0.8)', // Neutral color with transparency
    borderRadius: 25, // Circular shape
    zIndex: 1000,
    shadowColor: '#000', // Shadow for an elevated look
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullScreenButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  centeredView: {
    position: 'absolute', // Position absolutely within parent
    bottom: 75, // Position above the bottom bar, adjust the value as needed
    width: '100%', // Take full width of the parent
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20, // Add right radius for consistency
  },
  
  modalView: {
    width: '100%',
    backgroundColor: Colors.midnightBlue,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  
  buttonContainer: {
    backgroundColor: Colors.midnightBlue,
    flexDirection: 'row', // Arrange buttons side by side
    justifyContent: 'space-evenly', // Even spacing between buttons
    width: '100%', // Take full width of modal
  },
  
  button: {
    backgroundColor: Colors.uiucOrange,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    // Reduced margin as buttons are now side by side
  },
  
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  
  
});

export default MapsHome;
