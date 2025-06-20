import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useGameStore } from '../store/gameStore';

const LearningScreen = () => {
  // Ambil state dan fungsi dari store Zustand
  const { 
    currentAnimals, 
    currentAnimalIndex, 
    onAnimalTap, 
    isLoading 
  } = useGameStore(state => ({
      currentAnimals: state.currentAnimals,
      currentAnimalIndex: state.currentAnimalIndex,
      onAnimalTap: state.onAnimalTap,
      isLoading: state.isLoading,
  }));

  if (isLoading || currentAnimals.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const currentAnimal = currentAnimals[currentAnimalIndex];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onAnimalTap} activeOpacity={0.7}>
        <Image 
          key={currentAnimal.id} // Key penting untuk re-render
          source={{ uri: currentAnimal.imagePath }} // Muat gambar dari URI file lokal
          style={styles.animalImage} 
        />
        <Text style={styles.animalName}>{currentAnimal.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FFF0', // Warna latar yang ceria
  },
  animalImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  animalName: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
    textAlign: 'center',
  },
});

export default LearningScreen;