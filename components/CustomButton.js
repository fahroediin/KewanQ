// File: components/CustomButton.js

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Tambahkan prop 'disabled'
const CustomButton = ({ title, onPress, iconName, color = '#4CAF50', disabled = false }) => {
  return (
    // Gunakan 'disabled' prop dari TouchableOpacity
    // dan ubah opacity jika disabled
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: color },
        disabled && styles.disabledButton // Terapkan style disabled jika true
      ]} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={disabled}
    >
      <MaterialCommunityIcons name={iconName} size={30} color="white" style={styles.icon} />
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
    borderRadius: 30,
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
  disabledButton: {
    opacity: 0.5, // Buat tombol terlihat pudar saat nonaktif
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