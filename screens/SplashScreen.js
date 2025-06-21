// File: screens/SplashScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../api/supabaseClient';
import { downloadAsset } from '../api/assetManager';

const SplashScreen = ({ navigation }) => {
  const [status, setStatus] = useState('Mempersiapkan game...');

  useEffect(() => {
    const initializeGame = async () => {
      try {
        // --- LOGIKA CACHING DI-AKTIFKAN KEMBALI ---
        // Ini mencegah download berulang kali jika data sudah ada di HP
        // Hanya berlaku untuk mobile, web akan selalu mengambil data terbaru (tanpa download)
        if (Platform.OS !== 'web') {
            const isDataCached = await AsyncStorage.getItem('isDataCached');
            if (isDataCached === 'true') {
              setStatus('Data sudah siap! Memulai game...');
              setTimeout(() => navigation.replace('MainMenu'), 1000); // Jeda agar tulisan terbaca
              return;
            }
        }
        
        console.log("--- DEBUG SplashScreen: Mulai Inisialisasi Data Baru ---");

        setStatus('Menghubungi server...');
        const { data: categories, error: catError } = await supabase.from('categories').select('*');
        if (catError) throw new Error(`Gagal mengambil kategori: ${catError.message}`);
        
        const { data: animals, error: animError } = await supabase.from('animals').select('*');
        if (animError) throw new Error(`Gagal mengambil hewan: ${animError.message}`);
        
        console.log(`Ditemukan ${animals.length} data hewan untuk diunduh.`);
        
        const animalsWithLocalPaths = [];
        const totalDownloads = animals.length;
        let currentDownload = 0;

        for (const animal of animals) {
          currentDownload++;
          // --- TEKS STATUS YANG LEBIH INFORMATIF ---
          setStatus(`Mengunduh data... (${currentDownload}/${totalDownloads})`);

          const imagePath = await downloadAsset(animal.image_url);
          const audioNamePath = await downloadAsset(animal.audio_name_url);
          const audioCharPath = await downloadAsset(animal.audio_char_url);
          const audioFoodPath = await downloadAsset(animal.audio_food_url);
          const audioReproPath = await downloadAsset(animal.audio_repro_url);

          animalsWithLocalPaths.push({ ...animal, imagePath, audioNamePath, audioCharPath, audioFoodPath, audioReproPath });
        }
        
        setStatus('Menyimpan data ke perangkat...');
        await AsyncStorage.setItem('categories', JSON.stringify(categories));
        await AsyncStorage.setItem('animals', JSON.stringify(animalsWithLocalPaths));
        await AsyncStorage.setItem('isDataCached', 'true');
        console.log("Data berhasil disimpan ke AsyncStorage.");
        
        setStatus('Selesai! Memulai game...');
        setTimeout(() => navigation.replace('MainMenu'), 500);

      } catch (error) {
        console.error('--- GAGAL TOTAL INISIALISASI ---:', error);
        setStatus(`Gagal memuat: ${error.message}. Coba lagi nanti.`);
      }
    };

    initializeGame();
  }, [navigation]);

  return (
    // Bagian return ini tidak diubah, karena sudah berfungsi dengan benar untuk Anda
    <View style={styles.container}>
      <Image source={require('../assets/kewanq-logo.png')} style={styles.logo} />
      <ActivityIndicator size="large" color="#FF6347" /> 
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

// Stylesheet yang disempurnakan
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
  },
  logo: {
    width: 250, // Ukuran logo bisa disesuaikan
    height: 150, // Ukuran logo bisa disesuaikan
    resizeMode: 'contain',
    marginBottom: 50,
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default SplashScreen;