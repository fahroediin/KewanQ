// File: screens/CategoryScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import { Audio } from 'expo-av';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk melacak tombol mana yang sedang memutar suara,
  // untuk mencegah double-tap yang cepat.
  const [playingSoundId, setPlayingSoundId] = useState(null);

  // Fungsi untuk memutar suara kategori
  const playCategorySound = async (audioFileName) => {
    if (!audioFileName) return null;

    try {
      // Peta untuk mencocokkan nama file dengan path 'require' yang statis
      const soundMap = {
        'serangga.mp3': require('../assets/audio/categories/serangga.mp3'),
        'mamalia.mp3': require('../assets/audio/categories/mamalia.mp3'),
        'unggas.mp3': require('../assets/audio/categories/unggas.mp3'),
      };
      
      const { sound } = await Audio.Sound.createAsync(soundMap[audioFileName]);
      await sound.playAsync();
      return sound; // Kembalikan objek suara agar bisa dipantau
    } catch (e) {
      console.error("Gagal memutar suara kategori:", e);
      return null;
    }
  };

  // Fungsi yang dipanggil saat tombol ditekan
  const handleCategoryPress = async (item) => {
    // Jika sudah ada suara yang diputar, jangan lakukan apa-apa
    if (playingSoundId) return;

    // Tandai bahwa tombol ini sedang aktif
    setPlayingSoundId(item.id);

    const playedSound = await playCategorySound(item.audio_name);

    if (playedSound) {
      // Tambahkan listener untuk mendeteksi kapan suara selesai
      playedSound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) {
          // Setelah suara selesai, baru pindah layar
          navigation.navigate('Learning', { categoryId: item.id });
          playedSound.unloadAsync(); // Bersihkan suara dari memori
          setPlayingSoundId(null); // Reset state agar tombol lain bisa ditekan
        }
      });
    } else {
      // Jika tidak ada file suara, langsung navigasi
      navigation.navigate('Learning', { categoryId: item.id });
      setPlayingSoundId(null);
    }
  };
  
  // useEffect untuk memuat data kategori dari penyimpanan lokal
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ImageBackground 
      source={require('../assets/images/backgrounds/category-bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Pilih Kategori</Text>
        
        <View style={styles.buttonContainer}>
          {categories.map((item) => (
            <CustomButton
              key={item.id}
              title={item.name}
              iconName={item.icon_name}
              // Kirim seluruh objek 'item' ke handleCategoryPress
              // dan nonaktifkan tombol jika ada suara yang sedang diputar
              onPress={() => handleCategoryPress(item)}
              disabled={playingSoundId !== null} 
            />
          ))}
        </View>

      </View>
    </ImageBackground>
  );
};

// Stylesheet yang sudah ada (tidak perlu diubah)
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
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#386641',
    marginBottom: 40,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryScreen;