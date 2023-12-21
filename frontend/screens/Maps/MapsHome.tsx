import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Button, Modal, Animated, Dimensions, Image} from 'react-native';
import MapView, { Marker, Polyline, Circle , Region} from 'react-native-maps';
import * as Location from 'expo-location';
import { gymMarkers } from './GymMarkers';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MapsStackParamList } from './MapsNav';
import Colors from '../../constants/Colors';
import { Linking, Platform } from 'react-native';



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
  imageUrl: string;
  hours: string;
}

const openMapsApp = (latitude: number, longitude: number) => {
  const label = encodeURIComponent('Gym Location');
  const latLng = `${latitude},${longitude}`;

  const url = Platform.select({
    ios: `http://maps.apple.com/?ll=${latLng}&q=${label}`,
    android: `geo:${latLng}?q=${latLng}(${label})`
  });

  Linking.openURL(url ?? '').catch(err => console.error('An error occurred', err));
};

export const MapsHome: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<MapsStackParamList, 'GymInfo'>>();
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGym, setSelectedGym] = useState<MarkerData | null>(null);
  const mapRef = useRef<MapView>(null);
  const [displayBasicInfo, setDisplayBasicInfo] = useState(false);
  const [selectedMarkerKey, setSelectedMarkerKey] = useState<string | null>(null);



  const handleMarkerPress = (marker: MarkerData) => {
    setSelectedGym(marker);
    setModalVisible(true);
    setSelectedMarkerKey(marker.key); 
  };

  const navigateToGymData = () => {
    if (selectedGym) {
      const gym = selectedGym.key === '1' ? 'arc' : 'crce';
      navigation.navigate('GymData', { gym: gym, gymName: gym.toUpperCase() });
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
        {gymMarkers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => handleMarkerPress(marker)}
          >
            <View style={styles.markerContainer}>
              <Text 
                style={[
                  styles.markerTitle, 
                  { bottom: marker.key === selectedMarkerKey ? 42 : 30 }
                ]}
              >
                {marker.title}
              </Text>
              <TouchableOpacity onPress={() => handleMarkerPress(marker)}>
                <MaterialIcons
                  name="place"
                  size={marker.key === selectedMarkerKey ? 45 : 32} 
                  color={Colors.uiucOrange}
                />
              </TouchableOpacity>
            </View>
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
          setDisplayBasicInfo(false);
          setModalVisible(false);
          setSelectedMarkerKey(null);
        }}
      >
        <TouchableOpacity
          style={styles.fullScreenButton}
          activeOpacity={1}
          onPressOut={() => {
            setDisplayBasicInfo(false);
            setModalVisible(false);
            setSelectedMarkerKey(null);
          }}
        >
          {displayBasicInfo && selectedGym ? (
            <View style={styles.modalView}>
              <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setDisplayBasicInfo(false);
                    setModalVisible(true);
                  }}
                >
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedGym.title}</Text>
                        <View style={styles.gymContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.sectionHeader}>Hours</Text>
              </View>
              <View style={styles.hoursSection}>
                {selectedGym.hours.split('\n').map((line, index) => (
                  <Text key={index} style={styles.infoText}>{line}</Text>
                ))}
              </View>
            </View>
            <View style={styles.gymContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.sectionHeader}>Contact Information</Text>
              </View>
              <View style={styles.contactSection}>
                <Text style={styles.infoText}>Phone: {selectedGym.phone}</Text>
                <Text style={styles.infoText}>Website: {selectedGym.website}</Text>
                <Text style={styles.infoText}>Address: {selectedGym.address}</Text>
                <TouchableOpacity
                  style={styles.smallButton} 
                  onPress={() => openMapsApp(selectedGym.latitude, selectedGym.longitude)}
                >  
                  <Text style={styles.smallButtonText}>Directions</Text> 
                </TouchableOpacity>
              </View>
            </View>
          </View>          
          ) : (
            <View style={styles.gymDataModalView}> 
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setDisplayBasicInfo(true)}
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
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
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
  },
  
  recenterButton: {
    position: 'absolute',
    top: 10, 
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(52, 52, 52, 0.8)', 
    borderRadius: 25, 
    zIndex: 1000,
    shadowColor: '#000', 
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
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  
  modalView: {
    position: 'absolute',
    bottom: 75, 
    width: '100%',
    height: '50%',
    backgroundColor: Colors.midnightBlue,
    padding: 10,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'space-between',
    flexDirection: 'column', 
    flex: 1,
  },


  gymDataModalView: {
    position: 'absolute',
    bottom: 75, 
    width: '100%',
    height: '10%', 
    backgroundColor: Colors.midnightBlue,
    padding: 15,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    flexDirection: 'column', 
    flex: 1,
  },
  
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  
  buttonContainer: {
    backgroundColor: Colors.midnightBlue,
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',   
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    width: '100%', 
    alignItems: 'center',
  },
  
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    elevation: 2,

  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    zIndex: 1000, 
  },
  
  modalTitle: {
    color: Colors.uiucOrange,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  
  modalImage: {
    borderRadius: 10,
    width: '80%',
    height: 140,
    resizeMode: 'cover',
    alignSelf: 'center', 
    marginBottom: 0, 
    marginHorizontal: 20, 
  },
  
  modalContent: {
    backgroundColor: Colors.midnightBlue,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: '50%', // Adjust as needed
  },

  hoursSection: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 15,
  },

  contactSection: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  separator: {
    height: 1,
    backgroundColor: 'grey',
    width: '100%',
    marginVertical: 5,
  },

  smallButton: {
    backgroundColor: Colors.uiucOrange,
    borderRadius: 15,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  smallButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },

  button: {
    backgroundColor: Colors.uiucOrange,
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5, 
  },

  gymContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: Colors.subtleWhite, 
    borderColor: Colors.subtleWhite,  
    borderRadius: 8,             
    alignItems: "center",
    borderWidth: 2,                     
    shadowColor: '#000',              
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    width: '100%',
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5
  },
  infoText: {
    fontSize: 14,
    color: 'white', 
    marginBottom: 5,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.uiucOrange,
  },
});

export default MapsHome;