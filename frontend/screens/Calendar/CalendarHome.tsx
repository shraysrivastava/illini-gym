import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../constants/Colors";
import { Agenda } from "react-native-calendars";
import { fetchEvents } from "../../firebase/firestore"; // Make sure this import points to the correct file

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

export const CalendarHome = () => {
  const [items, setItems] = useState({});

  const loadItems = (day) => {
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
        let eventName = event.title;
        if (event.isClosed) {
          eventName = `${event.sectionKey} is Closed`;
        } else if (event.description && event.time) {
          eventName = `${event.description} from ${event.time}`;
        }
        // Check if the event already exists to avoid duplicates
        if (!newItems[date].some(item => item.name === eventName)) {
          newItems[date].push({
            name: eventName,
            height: 50
          });
        }
      });
      setItems(newItems);
    }).catch(error => {
      // console.error(error);
    });
  }, []);

  const renderItem = (item: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => {
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
    marginTop: 17,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginLeft: 10,
    marginBottom: 0,
    marginTop: 17,
  },
});
