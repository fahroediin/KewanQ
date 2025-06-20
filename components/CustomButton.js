// File: components/CustomButton.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Contoh icon

const CustomButton = ({ title, onPress, iconName, color = '#4CAF50' }) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.7}>
      {iconName && <MaterialCommunityIcons name={iconName} size={30} color="white" style={styles.icon} />}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30, // Sudut yang sangat bulat
    marginVertical: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginRight: 15,
  },
});

export default CustomButton;