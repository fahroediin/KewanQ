// File: screens/CategoryScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { useGameStore } from '../store/gameStore'; // Asumsi Anda membuat file ini

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const loadCategoryInStore = useGameStore(state => state.loadCategory);

  useEffect(() => {
    const loadData = async () => {
      const categoriesJson = await AsyncStorage.getItem('categories');
      if (categoriesJson) {
        setCategories(JSON.parse(categoriesJson));
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleCategoryPress = async (categoryId) => {
    // Ambil semua hewan dari storage
    const animalsJson = await AsyncStorage.getItem('animals');
    const allAnimals = animalsJson ? JSON.parse(animalsJson) : [];
    
    // Filter hewan berdasarkan kategori yang dipilih
    const filteredAnimals = allAnimals.filter(animal => animal.category_id === categoryId);
    
    // Kirim hewan yang sudah difilter ke state management (Zustand)
    loadCategoryInStore(filteredAnimals);
    
    // Pindah ke layar belajar
    navigation.navigate('Learning');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pilih Kelompok Hewan</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CustomButton
            title={item.name}
            iconName={item.icon_name} // contoh: 'ladybug', 'cow', 'duck'
            onPress={() => handleCategoryPress(item.id)}
          />
        )}
        contentContainerStyle={{ alignItems: 'center', width: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#F0FFF0',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#386641',
  },
});

export default CategoryScreen;