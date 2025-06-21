// File: screens/CategoryScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesJson = await AsyncStorage.getItem('categories');
        if (categoriesJson) {
          setCategories(JSON.parse(categoriesJson));
        }
      } catch (e) {
        console.error("Gagal memuat kategori:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('Learning', { categoryId: categoryId });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // Gunakan ImageBackground untuk gambar latar
    <ImageBackground 
      source={require('../assets/images/backgrounds/category-bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Pilih Kelompok Hewan</Text>
        
        {/* Container untuk tombol agar bisa dipusatkan */}
        <View style={styles.buttonContainer}>
          {categories.map((item) => (
            <CustomButton
              key={item.id}
              title={item.name}
              iconName={item.icon_name}
              onPress={() => handleCategoryPress(item.id)}
            />
          ))}
        </View>

      </View>
    </ImageBackground>
  );
};

// Stylesheet yang sudah dirapikan dan disempurnakan
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    // Kita tidak lagi memusatkan semua konten, hanya header dan button container
    alignItems: 'center', // Pusatkan header
    paddingTop: 80, // Beri jarak dari atas
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Overlay agar teks terbaca
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#386641', // Warna hijau tua
    marginBottom: 40,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    // Container ini akan memusatkan tombol-tombolnya
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryScreen;