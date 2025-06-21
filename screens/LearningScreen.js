// File: screens/LearningScreen.js

import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from '../store/gameStore';
import AnimalDisplay from '../components/AnimalDisplay';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const LearningScreen = ({ navigation, route }) => {
  const { categoryId } = route.params;

  // Ambil semua state yang dibutuhkan dari store
  const isLoading = useGameStore(state => state.isLoading);
  const currentAnimals = useGameStore(state => state.currentAnimals);
  const currentAnimalIndex = useGameStore(state => state.currentAnimalIndex);
  const tapCount = useGameStore(state => state.tapCount);
  
  const {
    loadCategory,
    onAnimalTap,
    setBackgroundMusicVolume,
    resetBackgroundMusicVolume,
  } = useGameStore.getState();

  // Hook untuk memuat data dan mengelola audio saat layar menjadi fokus/ditinggalkan
  useFocusEffect(
    useCallback(() => {
      setBackgroundMusicVolume(0.1);
      
      const getAnimalsForCategory = async () => {
        const animalsJson = await AsyncStorage.getItem('animals');
        const allAnimals = animalsJson ? JSON.parse(animalsJson) : [];
        const filteredAnimals = allAnimals.filter(animal => animal.category_id === categoryId);
        loadCategory(filteredAnimals);
      };
      getAnimalsForCategory();

      return () => {
        resetBackgroundMusicVolume();
      };
    }, [categoryId, loadCategory, resetBackgroundMusicVolume, setBackgroundMusicVolume])
  );

  // Hook untuk kembali otomatis setelah kategori selesai
  useEffect(() => {
    // KONDISI INI ADALAH KUNCI:
    // Jika tidak sedang loading DAN array hewan kosong, artinya kategori selesai
    if (!isLoading && currentAnimals.length === 0) {
      setTimeout(() => {
        console.log("Navigasi kembali karena kategori selesai.");
        navigation.goBack();
      }, 500);
    }
  }, [isLoading, currentAnimals, navigation]);

  const handleGoBack = () => {
    navigation.goBack();
  };
  
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
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back-circle" size={48} color="#4CAF50" />
      </TouchableOpacity>
      <AnimalDisplay animal={currentAnimal} onTap={onAnimalTap} />
      <View style={styles.tapIndicatorContainer}>
        {Array(4).fill(0).map((_, index) => (
          <View
            key={index}
            style={[
              styles.tapIndicatorDot,
              { backgroundColor: tapCount > index ? '#4CAF50' : '#d3d3d3' }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FFF0',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 10,
  },
  tapIndicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
  },
  tapIndicatorDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginHorizontal: 8,
  },
});

export default LearningScreen;