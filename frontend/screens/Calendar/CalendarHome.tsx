import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native"; 
import { RouteProp } from "@react-navigation/native";
import Colors from "../../constants/Colors";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { Agenda, CalendarProps } from "react-native-calendars";

const timeToString = (time: string | number | Date) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const predefinedItems = {
  '2023-11-19': [{ name: '11am - 3pm', height: 50 }],
  '2023-11-20': [{ name: '11am - 6pm', height: 50 }],
  '2023-11-21': [{ name: '11am - 6pm', height: 50 }],
  '2023-11-22': [{ name: '11am - 3pm', height: 50 }],
  '2023-11-23': [{ name: 'Closed', height: 50 }],
  '2023-11-24': [{ name: 'Closed', height: 50 }],
  '2023-11-25': [{ name: '11am - 3pm', height: 50 }],
  '2023-11-30': [{ name: '11am - 9pm', height: 50 }],
  '2023-12-07': [{ name: '12:00 - 2:00 pm, ARC Bouldering Cave, Study Break Boulder', height: 50 }],
  '2023-12-08': [{ name: 'All Day, ARC, SOS: Sweat Out Stress', height: 50 }],
  '2023-12-11': [{ name: 'All Day, ARC, SOS: Sweat Out Stress', height: 50 }],
  '2023-12-12': [{ name: 'All Day, ARC, SOS: Sweat Out Stress', height: 50 }],
  '2023-12-14': [{ name: 'All Day, ARC, SOS: Sweat Out Stress', height: 50 }],
  '2023-12-15': [{ name: 'All Day, ARC, SOS: Sweat Out Stress', height: 50 }],
  '2024-01-09': [{ name: '11:00 am - 6:00 pm, Activities & Recreation Center (ARC), Faculty and Staff FREE Day', height: 50 }],
  '2023-12-03': [
    { name: '12:00pm - 12:50pm, Sculpt and Flow, Mind/Body, ARC MP4', height: 50 },
    { name: '1:00pm - 2:00pm, Zumba, Rhythmic/Dance, ARC MP4', height: 50 }
  ],
  // ... Add more dates and events as needed
};

type ItemsType = { [key: string]: { name: string; height: number }[] };

export const CalendarHome = ({ }: CalendarProps) => {
  const [items, setItems] = useState(predefinedItems);

  const renderItem = (item: { name: string; height: number }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        {}
      </View>
    );
  };

  const loadItems = (day: { timestamp: number; }) => {
    setTimeout(() => {
      setItems((currentItems) => {
        const updatedItems: ItemsType = { ...currentItems };
  
        for (let i = -15; i < 85; i++) {
          const time = day.timestamp + i * 24 * 60 * 60 * 1000;
          const strTime = timeToString(time);
  
          if (!updatedItems[strTime]) {
            updatedItems[strTime] = [{
              name: 'Nothing for ' + strTime,
              height: 50 
            }];
          }
        }
        return updatedItems;
      });
    }, 1000);
  };
  

  const today = new Date();
  const currentDay = timeToString(today);

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={currentDay}
        renderItem={renderItem} 
        theme={{
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingBottom: 0,
  },
  item: {
    
    borderRadius: 0,
    padding: 10,
    marginRight: 10,
    marginTop: 40,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
