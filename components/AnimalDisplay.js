// File: components/AnimalDisplay.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const AnimalDisplay = ({ animal, onTap }) => {
  if (!animal) return null; // Jika tidak ada hewan, jangan tampilkan apa-apa

  return (
    <TouchableOpacity onPress={onTap} activeOpacity={0.8}>
      <View style={styles.container}>
        {/* Key unik membantu React Native mendeteksi perubahan dan menjalankan animasi */}
        <Image
          key={animal.id}
          source={{ uri: animal.imagePath }}
          style={styles.animalImage}
        />
        <Text style={styles.animalName}>{animal.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  animalName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#386641', // Warna hijau tua
    marginTop: 15,
    textTransform: 'capitalize',
  },
});

export default AnimalDisplay;