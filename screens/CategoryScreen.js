// File: screens/CategoryScreen.js

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { Audio } from 'expo-av';
import AnimatedBackground from '../components/AnimatedBackground'; // Pastikan import ini ada

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingSoundId, setPlayingSoundId] = useState(null);

  // useEffect untuk suara intro kategori (logika tidak diubah)
  useEffect(() => {
    let soundObject = null;
    const playIntroSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/categories/pilih-jenis-hewan.mp3')
        );
        soundObject = sound;
        await soundObject.playAsync();
      } catch (error) { console.error("Gagal memutar suara intro kategori:", error); }
    };
    playIntroSound();
    return () => {
      if (soundObject) soundObject.unloadAsync();
    };
  }, []);

  // useEffect untuk memuat data kategori (logika tidak diubah)
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

  // handleCategoryPress (logika tidak diubah)
  const handleCategoryPress = async (item) => {
    if (playingSoundId) return;
    setPlayingSoundId(item.id);

    const soundMap = {
      'serangga.mp3': require('../assets/audio/categories/serangga.mp3'),
      'mamalia.mp3': require('../assets/audio/categories/mamalia.mp3'),
      'unggas.mp3': require('../assets/audio/categories/unggas.mp3'),
    };
    
    try {
      if (item.audio_name && soundMap[item.audio_name]) {
        const { sound } = await Audio.Sound.createAsync(soundMap[item.audio_name]);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) {
            navigation.navigate('Learning', { categoryId: item.id });
            sound.unloadAsync();
            setPlayingSoundId(null);
          }
        });
      } else {
        navigation.navigate('Learning', { categoryId: item.id });
        setPlayingSoundId(null);
      }
    } catch (error) {
      console.error("Gagal memutar suara tombol kategori:", error);
      navigation.navigate('Learning', { categoryId: item.id });
      setPlayingSoundId(null);
    }
  };

  // Tampilan Loading
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
    // Gunakan AnimatedBackground dan kirimkan source gambar yang sesuai
    <AnimatedBackground source={require('../assets/images/backgrounds/category-bg.png')}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
              disabled={playingSoundId !== null} 
            />
          ))}
        </View>
          console.log("Data 'categories' yang akan di-render:", JSON.stringify(categories, null, 2));


      </View>
    </AnimatedBackground>
  );
};

// Stylesheet yang disesuaikan untuk layout baru (tidak perlu diubah dari versi sebelumnya)
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  logo: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80,
  },
});

export default CategoryScreen;