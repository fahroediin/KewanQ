// File: screens/CategoryScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { Audio } from 'expo-av';
import AnimatedBackground from '../components/AnimatedBackground';
import { useGameStore } from '../store/gameStore';
import { playClickSound } from '../utils/audioHelper';
import LoadingAnimation from '../components/LoadingAnimation'; // Import animasi loading

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const { resetLearningState, loadCategory } = useGameStore.getState();

  // useEffect untuk suara intro kategori
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

  // useEffect untuk memuat data kategori
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

  // useEffect untuk mereset state saat kembali ke layar ini
  useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
          setIsNavigating(false);
      });
      return unsubscribe;
  }, [navigation]);

  // Fungsi yang di-enhance dengan Promise.all
  const handleCategoryPress = async (item) => {
    if (isNavigating) return;

    // 1. Tampilkan loading overlay dan reset state
    setIsNavigating(true);
    resetLearningState();
    
    // TUGAS A: Memainkan Suara Kategori
    const playSoundPromise = new Promise(async (resolve) => {
      const soundMap = {
        'serangga.mp3': require('../assets/audio/categories/serangga.mp3'),
        'mamalia.mp3': require('../assets/audio/categories/mamalia.mp3'),
        'unggas.mp3': require('../assets/audio/categories/unggas.mp3'),
      };
      
      if (item.audio_name && soundMap[item.audio_name]) {
        try {
          const { sound } = await Audio.Sound.createAsync(soundMap[item.audio_name]);
          await sound.playAsync();
          sound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) {
              sound.unloadAsync();
              resolve('sound finished');
            }
          });
        } catch (e) {
          console.error("Gagal memutar suara kategori:", e);
          resolve('sound error');
        }
      } else {
        resolve('no sound'); // Langsung selesai jika tidak ada suara
      }
    });

    // TUGAS B: Pre-fetching Data Hewan
    const fetchDataPromise = new Promise(async (resolve) => {
        try {
            const animalsJson = await AsyncStorage.getItem('animals');
            const allAnimals = animalsJson ? JSON.parse(animalsJson) : [];
            const filteredAnimals = allAnimals.filter(animal => animal.category_id === item.id);
            loadCategory(filteredAnimals);
            resolve('data ready');
        } catch (e) {
            console.error("Gagal pre-fetch data:", e);
            loadCategory([]);
            resolve('data error');
        }
    });

    // 2. Tunggu KEDUA tugas selesai
    await Promise.all([playSoundPromise, fetchDataPromise]);

    // 3. Setelah semua siap, baru navigasi
    navigation.navigate('Learning', { categoryId: item.id });
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
        
        {isNavigating && <LoadingAnimation />}
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
});

export default CategoryScreen;