// File: screens/CategoryScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { Audio } from 'expo-av';
import AnimatedBackground from '../components/AnimatedBackground';
import { useGameStore } from '../store/gameStore';
import { playClickSound } from '../utils/audioHelper';
import LoadingAnimation from '../components/LoadingAnimation';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  
  // Gunakan useRef untuk menyimpan referensi ke suara intro
  const introSoundRef = useRef(null);

  const { resetLearningState, loadCategory } = useGameStore.getState();

  // useEffect untuk suara intro kategori
  useEffect(() => {
    const playIntroSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(require('../assets/audio/categories/pilih-jenis-hewan.mp3'));
        introSoundRef.current = sound; // Simpan objek suara ke ref
        await sound.playAsync();
      } catch (error) { console.error("Gagal memutar suara intro kategori:", error); }
    };
    playIntroSound();
    
    // Fungsi cleanup
    return () => { 
      if (introSoundRef.current) {
        introSoundRef.current.unloadAsync();
      }
    };
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
      setIsProcessing(false);
      setSelectedIcon(null);
    });
    return unsubscribe;
  }, [navigation]);

  // Fungsi yang didesain ulang untuk alur berurutan yang lebih halus
  const handleCategoryPress = async (item) => {
    if (isProcessing) return;
    
    // 1. Hentikan suara intro jika sedang berjalan
    if (introSoundRef.current) {
      await introSoundRef.current.stopAsync();
      await introSoundRef.current.unloadAsync();
      introSoundRef.current = null; // Hapus referensi
    }

    // 2. Reset state dan nonaktifkan tombol
    resetLearningState();
    setIsProcessing(true);
    setSelectedIcon(item.icon_name);

    // --- TAHAP 1: Putar Suara Kategori dan Tunggu ---
    const soundMap = {
      'serangga.mp3': require('../assets/audio/categories/serangga.mp3'),
      'mamalia.mp3': require('../assets/audio/categories/mamalia.mp3'),
      'unggas.mp3': require('../assets/audio/categories/unggas.mp3'),
    };
    
    const playSoundAndWait = new Promise(async (resolve) => {
      if (item.audio_name && soundMap[item.audio_name]) {
        try {
          const { sound } = await Audio.Sound.createAsync(soundMap[item.audio_name]);
          await sound.playAsync();
          sound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) {
              sound.unloadAsync();
              resolve();
            }
          });
        } catch (e) { resolve(); }
      } else {
        resolve();
      }
    });

    await playSoundAndWait;
    // --- TAHAP 2: Pre-fetch Data (Animasi Loading akan muncul sekarang) ---
    try {
        const animalsJson = await AsyncStorage.getItem('animals');
        const allAnimals = animalsJson ? JSON.parse(animalsJson) : [];
        const filteredAnimals = allAnimals.filter(animal => animal.category_id === item.id);
        loadCategory(filteredAnimals);
    } catch (e) {
        loadCategory([]);
    }

    // --- TAHAP 3: Navigasi ---
    navigation.navigate('Learning', { categoryId: item.id });
  };

  const handleGoBack = async () => {
    // Hentikan juga suara intro saat menekan tombol kembali
    if (introSoundRef.current) {
        await introSoundRef.current.stopAsync();
        await introSoundRef.current.unloadAsync();
        introSoundRef.current = null;
    }
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
              disabled={isProcessing} 
            />
          ))}
        </View>
        
        {isProcessing && <LoadingAnimation iconName={selectedIcon} />}
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