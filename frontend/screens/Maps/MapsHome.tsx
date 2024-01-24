import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Button,
  Modal,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import MapView, { Marker, Polyline, Circle, Region } from "react-native-maps";
import { gymMarkers } from "./GymMarkers";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MapsStackParamList } from "./MapsNav";
import Colors from "../../constants/Colors";
import { Linking, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

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
  hours: { day: string; time: string }[];
  phone: string;
  website: string;
}

const openMapsApp = (latitude: number, longitude: number) => {
  const destination = encodeURIComponent(`${latitude},${longitude}`);
  const url = `http://maps.google.com/maps?daddr=${destination}`;

  Linking.openURL(url).catch((err) => {
    // console.error("An error occurred", err);
  });
};

const openWebsite = (url: string) => {
  Linking.openURL(url).catch((err) => {
    // console.error("An error occurred", err);
  });
};

const makeCall = (phoneNumber: string) => {
  const url = `tel:${phoneNumber}`;
  Linking.openURL(url).catch((err) => {
    // console.error("An error occurred trying to call", err)
  });
};

export const MapsHome: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<MapsStackParamList, "GymInfo">>();
  // const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(
  //   null
  // );
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGym, setSelectedGym] = useState<MarkerData | null>(null);
  const mapRef = useRef<MapView>(null);
  const [displayBasicInfo, setDisplayBasicInfo] = useState(false);
  const [selectedMarkerKey, setSelectedMarkerKey] = useState<string | null>(
    null
  );
  const [navigatedAway, setNavigatedAway] = useState(false);

  const handleMarkerPress = (marker: MarkerData) => {
    setSelectedGym(marker);
    setModalVisible(true);
    setSelectedMarkerKey(marker.key);
  };

  const navigateToGymData = () => {
    if (selectedGym) {
      if (selectedGym.key === "2") {
        // Assuming key "2" is for CRCE
        // Show an alert or navigate to a Coming Soon screen
        Alert.alert("Coming Soon", "This feature will be available soon.");
      } else {
        let gym;
        switch (selectedGym.key) {
          case "1":
            gym = "arc";
            break;
          case "2":
            gym = "crce";
            break;
          default:
            gym = "dev";
        }
        navigation.navigate("GymData", {
          gym: gym,
          gymName: gym.toUpperCase(),
        });
      }
      setModalVisible(false);
      setNavigatedAway(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (navigatedAway && selectedGym) {
        setModalVisible(true);
        setNavigatedAway(false);
      }
    }, [navigatedAway, selectedGym])
  );

  useFocusEffect(
    useCallback(() => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(INITIAL_REGION, 1000);
      }
    }, [])
  );

  useEffect(() => {}, []);

  const resetMapToInitialRegion = () => {
    mapRef.current?.animateToRegion(INITIAL_REGION, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={false}
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
                  { bottom: marker.key === selectedMarkerKey ? 42 : 30 },
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
      </MapView>
      <TouchableOpacity
        style={styles.recenterButton}
        onPress={resetMapToInitialRegion}
      >
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
        <View style={styles.fullScreenButton}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPressOut={() => {
              setDisplayBasicInfo(false);
              setModalVisible(false);
              setSelectedMarkerKey(null);
            }}
          />
          {displayBasicInfo && selectedGym ? (
            <View style={styles.modalView}>
              <ScrollView
                style={{ flex: 1, width: "100%" }}
                contentContainerStyle={{ alignItems: "stretch" }}
                showsVerticalScrollIndicator={true}
              >
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
                    {selectedGym.hours.map((hour, index) => (
                      <View key={index} style={styles.hourRow}>
                        <Text style={styles.dayText}>{hour.day}</Text>
                        <Text style={styles.timeText}>{hour.time}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.gymContainer}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.sectionHeader}>
                      Contact Information
                    </Text>
                  </View>
                  <View style={styles.contactSection}>
                    <View style={styles.contactSection}>
                      <Text style={styles.infoText}>Phone:</Text>
                      <TouchableOpacity
                        onPress={() => makeCall(selectedGym.phone)}
                      >
                        <Text style={styles.callText}>{selectedGym.phone}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.contactSection}>
                      <Text style={styles.infoText}>Website:</Text>
                      <TouchableOpacity
                        onPress={() => openWebsite(selectedGym.website)}
                      >
                        <Text style={styles.linkText}>
                          {selectedGym.website}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.contactSection}>
                      <View style={styles.addressContainer}>
                        <Text style={styles.infoText}>Address:</Text>
                        <TouchableOpacity
                          onPress={() =>
                            openMapsApp(
                              selectedGym.latitude,
                              selectedGym.longitude
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.linkText, // Reuse the linkText style for underline and color
                              { marginTop: 5 }, // Add margin for separation, adjust as needed
                            ]}
                          >
                            {selectedGym.address}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          ) : (
            <View style={styles.gymDataModalView}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setDisplayBasicInfo(true)}
                >
                  <Text style={styles.buttonText}>About</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={navigateToGymData}
                >
                  <Text style={styles.buttonText}>View Sections</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerTitle: {
    color: Colors.midnightBlue,
    fontWeight: "bold",
    position: "absolute",
    textAlign: "center",
    width: 100,
    flexShrink: 1,
    zIndex: 1,
  },

  recenterButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    borderRadius: 25,
    zIndex: 1000,
    elevation: 5,
  },
  fullScreenButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  modalView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "50%",
    backgroundColor: Colors.midnightBlue,
    padding: "5%",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    flexDirection: "column",
    flex: 1,
  },

  gymDataModalView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "10%",
    backgroundColor: Colors.midnightBlue,
    padding: 15,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,    
    elevation: 5,
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    elevation: 2,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    left: 0,
    // padding: 10,
    zIndex: 1000,
  },

  modalTitle: {
    color: Colors.uiucOrange,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    
  },

  hoursSection: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 0,
  },

  contactSection: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 0,
  },

  addressContainer: {
    alignItems: "flex-start", // Align items to the start of the container
    marginBottom: 0,
  },

  separator: {
    height: 1,
    backgroundColor: "grey",
    width: "100%",
    marginVertical: 5,
  },

  directionsText: {
    marginLeft: 10,
    textDecorationLine: "underline",
    color: "white",
  },

  button: {
    backgroundColor: Colors.uiucOrange,
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },

  gymContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: Colors.subtleWhite,
    borderColor: Colors.subtleWhite,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    elevation: 2,
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },

  dayText: {
    flex: 1,
    fontSize: 14,
    color: "white",
    textAlign: "left",
  },

  timeText: {
    flex: 1,
    fontSize: 14,
    color: "white",
    textAlign: "right",
  },

  infoText: {
    fontSize: 12,
    color: "white",
    marginBottom: 5,
  },
  linkText: {
    color: Colors.lightBlue,
    textDecorationLine: "underline",
  },
  callText: {
    color: "green",
    textDecorationLine: "underline",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.uiucOrange,
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default MapsHome;
