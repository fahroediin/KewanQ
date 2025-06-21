// File: screens/CategoryScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { Audio } from 'expo-av';
import AnimatedBackground from '../components/AnimatedBackground';
import { useGameStore } from '../store/gameStore';
import { playClickSound } from '../utils/audioHelper';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Untuk loading awal saat membuka layar
  const [isNavigating, setIsNavigating] = useState(false); // Untuk loading overlay saat menekan tombol
  
  // Ambil fungsi yang dibutuhkan dari store
  const { resetLearningState, loadCategory } = useGameStore.getState();

  // useEffect untuk suara intro kategori (tidak berubah)
  useEffect(() => {
    let soundObject = null;
    const playIntroSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(require('../assets/audio/categories/pilih-jenis-hewan.mp3'));
        soundObject = sound;
        await soundObject.playAsync();
      } catch (error) { console.error("Gagal memutar suara intro kategori:", error); }
    };
    playIntroSound();
    return () => { if (soundObject) soundObject.unloadAsync(); };
  }, []);

  // useEffect untuk memuat data kategori (tidak berubah)
  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesJson = await AsyncStorage.getItem('categories');
        if (categoriesJson) setCategories(JSON.parse(categoriesJson));
      } catch (e) { console.error("Gagal memuat kategori:", e); } 
      finally { setIsLoading(false); }
    };
    loadData();
  }, []);

  // useEffect untuk mereset state isNavigating saat kembali ke layar ini
  useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
          setIsNavigating(false);
      });
      return unsubscribe;
  }, [navigation]);

  // Fungsi yang di-enhance dengan pre-fetching data
  const handleCategoryPress = async (item) => {
    if (isNavigating) return;

    // 1. Tampilkan loading overlay segera
    setIsNavigating(true);

    // 2. Reset state game sebelumnya
    resetLearningState();
    
    // 3. Lakukan pre-fetching data di sini
    try {
      console.log(`Pre-fetching data untuk kategori ID: ${item.id}`);
      const animalsJson = await AsyncStorage.getItem('animals');
      const allAnimals = animalsJson ? JSON.parse(animalsJson) : [];
      const filteredAnimals = allAnimals.filter(animal => animal.category_id === item.id);
      
      // 4. Muat data yang sudah siap ke dalam store
      loadCategory(filteredAnimals);
      console.log(`Pre-fetching selesai. Ditemukan ${filteredAnimals.length} hewan.`);

    } catch(e) {
      console.error("Gagal pre-fetch data hewan:", e);
      loadCategory([]); // Kirim array kosong jika gagal
    }

    // 5. Setelah semua data siap, baru navigasi
    setTimeout(() => {
      navigation.navigate('Learning', { categoryId: item.id });
    }, 50); // Jeda singkat agar overlay sempat render
  };

  const handleGoBack = () => {
    playClickSound();
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <AnimatedBackground source={require('../assets/images/backgrounds/category-bg.png')}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground source={require('../assets/images/backgrounds/category-bg.png')}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Image source={require('../assets/images/buttons/icon-back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Image source={require('../assets/images/kewanq-logo.png')} style={styles.logo} />
        <View style={styles.buttonContainer}>
          {categories.map((item) => (
            <CustomButton 
              key={item.id} 
              title={item.name} 
              iconName={item.icon_name} 
              onPress={() => handleCategoryPress(item)} 
              disabled={isNavigating} 
            />
          ))}
        </View>

        {isNavigating && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Mempersiapkan...</Text>
          </View>
        )}
      </View>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  backIcon: { width: 60, height: 60, resizeMode: 'contain' },
  logo: { position: 'absolute', top: 50, right: 20, width: 120, height: 40, resizeMode: 'contain' },
  buttonContainer: { width: '100%', alignItems: 'center', marginTop: 80 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  loadingText: {
    marginTop: 15,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategoryScreen;