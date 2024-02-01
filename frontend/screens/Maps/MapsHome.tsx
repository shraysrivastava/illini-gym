import React, { useState, useEffect, useRef, useCallback } from "react";
import { Alert, StyleSheet, View, TouchableOpacity,} from "react-native";
import MapView, { Marker, } from "react-native-maps";
import { gymMarkers } from "./GymMarkers";
import { MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MapsStackParamList } from "./MapsNav";
import Colors from "../../constants/Colors";
import MarkerComponent from "./MarkerComponent";
import ModalComponent from "./ModalComponent";

const INITIAL_REGION = {
  latitude: 40.10385157161382,
  longitude: -88.23056902208337,
  latitudeDelta: 0.03,
  longitudeDelta: 0.01,
};

export interface MarkerData {
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

export const MapsHome: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<MapsStackParamList, "GymInfo">>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGym, setSelectedGym] = useState<MarkerData | null>(null);
  const mapRef = useRef<MapView>(null);
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
    <View style={styles.container}>
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
          >
            <MarkerComponent
              marker={marker}
              onPress={() => handleMarkerPress(marker)}
              isSelected={marker.key === selectedMarkerKey}
            />
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity
        style={styles.recenterButton}
        onPress={resetMapToInitialRegion}
      >
        <MaterialIcons name="my-location" size={24} color="white" />
      </TouchableOpacity>
      <ModalComponent
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        setSelectedMarkerKey={setSelectedMarkerKey}
        navigateToGymData={navigateToGymData}
        selectedGym={selectedGym}
      />
    </View>
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
});

export default MapsHome;