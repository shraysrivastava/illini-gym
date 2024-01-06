import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

interface ToastProps {
    message: string;
    color: any;
};

const CustomToast: React.FC<ToastProps> = ({ message, color }) => {
    const [isVisible, setIsVisible] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const backgroundColor = color;
    const textColor = message.includes('Changes') ? 'white' : 'white';

    useEffect(() => {
      if (message) {
        setIsVisible(true);
  
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
  
        const timeout = setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => setIsVisible(false));
        }, 2000);
  
        return () => clearTimeout(timeout);
      }
    }, [message]);
    
    const closeToast = () => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setIsVisible(false));
      };
    
    if (!isVisible) return null;
  
    return (
      
        <Animated.View style={[styles.toast, { opacity, backgroundColor }]}>
          <TouchableOpacity onPress={closeToast} style={{width: '100%'}}>
            <Text style={[styles.text, { color: textColor }]}>{message}</Text>
          </TouchableOpacity>
        </Animated.View>
      );
  };
  

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 12, 
    fontWeight: 'bold', 
  },
  
});


export default CustomToast;
