// File: screens/SplashScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../api/supabaseClient';
import { downloadAsset } from '../api/assetManager'; // Asumsi Anda membuat file ini

const SplashScreen = ({ navigation }) => {
  const [status, setStatus] = useState('Mempersiapkan game...');

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const isDataCached = await AsyncStorage.getItem('isDataCached');

        if (isDataCached === 'true') {
          setStatus('Data sudah siap! Memulai game...');
          navigation.replace('MainMenu'); // Langsung ke menu utama jika data sudah ada
          return;
        }

        // --- Proses Download Jika Data Belum Ada ---
        setStatus('Mengunduh data kategori...');
        const { data: categories, error: catError } = await supabase.from('categories').select('*');
        if (catError) throw catError;

        setStatus('Mengunduh data hewan...');
        const { data: animals, error: animError } = await supabase.from('animals').select('*');
        if (animError) throw animError;
        
        const animalsWithLocalPaths = [];

        for (const animal of animals) {
          setStatus(`Mengunduh ${animal.name}...`);
          // Download semua aset dan dapatkan path lokalnya
          const imagePath = await downloadAsset(animal.image_url);
          const audioNamePath = await downloadAsset(animal.audio_name_url);
          const audioCharPath = await downloadAsset(animal.audio_char_url);
          const audioFoodPath = await downloadAsset(animal.audio_food_url);
          const audioReproPath = await downloadAsset(animal.audio_repro_url);

          animalsWithLocalPaths.push({ ...animal, imagePath, audioNamePath, audioCharPath, audioFoodPath, audioReproPath });
        }
        
        // Simpan data yang sudah memiliki path lokal ke AsyncStorage
        setStatus('Menyimpan data ke perangkat...');
        await AsyncStorage.setItem('categories', JSON.stringify(categories));
        await AsyncStorage.setItem('animals', JSON.stringify(animalsWithLocalPaths));
        await AsyncStorage.setItem('isDataCached', 'true'); // Tandai bahwa data sudah dicache

        setStatus('Selesai! Memulai game...');
        navigation.replace('MainMenu');

      } catch (error) {
        console.error('Gagal inisialisasi:', error);
        setStatus(`Terjadi kesalahan: ${error.message}. Coba lagi nanti.`);
        // Di sini bisa ditambahkan tombol "Coba Lagi"
      }
    };

    initializeGame();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/kewanq-logo.png')} style={styles.logo} />
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.statusText}>{status}</Text>
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default SplashScreen;