import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type ModalComponentProps = {
    isModalVisible: boolean;
    setModalVisible: any;
    setSelectedMarkerKey: any;
    navigateToGymData: any;
    selectedGym: any;
  };

const ModalComponent: React.FC<ModalComponentProps> = ({
  isModalVisible,
  setModalVisible,
  setSelectedMarkerKey,
  navigateToGymData,
  selectedGym,
}) => {
  const [displayBasicInfo, setDisplayBasicInfo] = useState(false);

  const openMapsApp = (latitude: number, longitude: number) => {
    const destination = encodeURIComponent(`${latitude},${longitude}`);
    const url = `http://maps.google.com/maps?daddr=${destination}`;

    Linking.openURL(url).catch((err) => {
    });
  };

  const openWebsite = (url: string) => {
    Linking.openURL(url).catch((err) => {
    });
  };

  const makeCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) => {
    });
  };

  return (
    <>
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
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setDisplayBasicInfo(false);
                    setModalVisible(true);
                  }}
                >
                  <MaterialIcons name="close" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedGym.title}</Text>
                <View style={{ width: 24 }}></View>
              </View>
              <ScrollView
                style={{ flex: 1, width: "100%" }}
                contentContainerStyle={{ alignItems: "stretch" }}
                showsVerticalScrollIndicator={true}
              >
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
                              styles.linkText, 
                              { marginTop: 5 }, 
                            ]}
                          >
                            {selectedGym.address}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.separator} />

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
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
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
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  modalTitle: {
    color: Colors.uiucOrange,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    flex: 1,
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
    borderColor: Colors.uiucBlue,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
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
    color: Colors.gray,
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

export default ModalComponent;
