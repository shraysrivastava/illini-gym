import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../constants/Colors";
import { Agenda } from "react-native-calendars";
import { fetchEvents } from "../../firebase/firestore";

const timeToString = (time: string | number | Date) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

export const CalendarHome = () => {
  const [items, setItems] = useState({});

  const loadItems = (day: { timestamp: number; }) => {
    const newItems = { ...items };
    for (let i = -15; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = timeToString(time);
      if (!newItems[strTime]) {
        newItems[strTime] = []; // No default items
      }
    }
    setItems(newItems);
  };
  useEffect(() => {
    fetchEvents().then(fetchedEvents => {
      const newItems = {};
      fetchedEvents.forEach(event => {
        const date = timeToString(event.date);
        newItems[date] = newItems[date] || [];
        const eventName = event.isClosed ? `${event.sectionKey} is Closed` : `${event.description} at ${event.time}`;
        const eventExists = newItems[date].some(item => item.name === eventName);
        if (!eventExists) {
          newItems[date].push({
            name: eventName,
            height: 50
          });
        }
      });
      setItems(newItems);
    }).catch(error => console.error(error));
  }, []);
  

  const renderItem = (item: { name: string; }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemTitle}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Agenda
      items={items}
      loadItemsForMonth={loadItems}
      selected={timeToString(new Date())}
      renderItem={renderItem}
    />
    </View>
    );
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: Colors.white,
},
item: {
borderRadius: 0,
padding: 10,
marginRight: 10,
marginTop: 40,
},
itemTitle: {
  fontSize: 16,
  fontWeight: '500', // Change to 'normal' or any desired weight
  color: '#333333', // Update the text color for better readability
  marginLeft: 10, // Add margin to align the text properly within the item
  marginBottom: -10,
  marginTop: -10,
},
});