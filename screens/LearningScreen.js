// screens/LearningScreen.js

// 1. Pastikan Anda mengimpor useEffect
import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useGameStore } from '../store/gameStore';
import AnimalDisplay from '../components/AnimalDisplay';

const LearningScreen = ({ route }) => {
  const { categoryId } = route.params;

  // 2. Ambil semua state dan fungsi yang kita butuhkan dari store
  const {
    currentAnimals,
    currentAnimalIndex,
    isLoading,
    loadCategory, // Fungsi untuk memuat data dari AsyncStorage
    onAnimalTap,  // Fungsi untuk handle tap pada hewan
  } = useGameStore();

  // 3. Gunakan useEffect untuk memuat data HANYA SATU KALI
  useEffect(() => {
    // Fungsi ini akan dijalankan setelah komponen pertama kali render
    // dan tidak akan dijalankan lagi, sehingga memutus infinite loop.
    const getAnimalsForCategory = async () => {
      // Ambil semua hewan dari storage
      const animalsJson = await AsyncStorage.getItem('animals'); // <-- Pastikan import AsyncStorage
      const allAnimals = animalsJson ? JSON.parse(animalsJson) : [];
      // Filter hewan berdasarkan kategori yang dipilih
      const filteredAnimals = allAnimals.filter(animal => animal.category_id === categoryId);
      // Kirim hewan yang sudah difilter ke store
      loadCategory(filteredAnimals);
    };

    getAnimalsForCategory();
  }, [categoryId]); // Dependency array memastikan ini hanya berjalan jika categoryId berubah

  if (isLoading || currentAnimals.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Ambil hewan yang sedang aktif dari store
  const currentAnimal = currentAnimals[currentAnimalIndex];

  return (
    <View style={styles.container}>
      <AnimalDisplay
        animal={currentAnimal}
        onTap={onAnimalTap}
      />
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
});

export default LearningScreen;