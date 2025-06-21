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
        // --- BLOK KODE BARU UNTUK MENGHAPUS CACHE LAMA ---
        // Ini akan berjalan setiap kali aplikasi dimulai.
        console.log("!!! Memaksa penghapusan cache lama dari AsyncStorage untuk development !!!");
        await AsyncStorage.removeItem('isDataCached');
        await AsyncStorage.removeItem('categories');
        await AsyncStorage.removeItem('animals');
        console.log("Cache lama berhasil dihapus.");
        // ---------------------------------------------------------
        
        // Logika caching yang ada sebelumnya sekarang tidak lagi diperlukan
        // karena kita selalu menghapus cache di atas.

        console.log("--- DEBUG SplashScreen: Memulai Inisialisasi Data Baru ---");

        setStatus('Menghubungi server...');
        const { data: categories, error: catError } = await supabase.from('categories').select('*');
        if (catError) throw new Error(`Gagal mengambil kategori: ${catError.message}`);
        
        const { data: animals, error: animError } = await supabase.from('animals').select('*');
        if (animError) throw new Error(`Gagal mengambil hewan: ${animError.message}`);
        
        console.log(`Ditemukan ${animals.length} data hewan untuk diunduh.`);
        
        // Jika tidak ada data hewan sama sekali, hentikan lebih awal
        if (!animals || animals.length === 0) {
            setStatus('Tidak ada data hewan yang ditemukan di server.');
            return; // Hentikan proses
        }

        const animalsWithLocalPaths = [];
        const totalDownloads = animals.length;
        let currentDownload = 0;

        for (const animal of animals) {
          currentDownload++;
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
        await AsyncStorage.setItem('isDataCached', 'true'); // Tandai bahwa cache sudah ada (untuk rilis nanti)
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
    <View style={styles.container}>
      <Image source={require('../assets/images/kewanq-logo.png')} style={styles.logo} />
      <ActivityIndicator size="large" color="#FF6347" /> 
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
  },
  logo: {
    width: 250,
    height: 150,
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