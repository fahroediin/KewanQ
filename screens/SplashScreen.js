// File: screens/SplashScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../api/supabaseClient';
import { downloadAsset } from '../api/assetManager';
import { preloadAssets } from '../utils/assetPreloader'; // Import fungsi preloading

const SplashScreen = ({ navigation }) => {
  const [status, setStatus] = useState('Mempersiapkan game...');

  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Hapus cache hanya untuk development, beri komentar sebelum rilis
        console.log("!!! Menghapus cache lama untuk development !!!");
        await AsyncStorage.multiRemove(['isDataCached', 'categories', 'animals']);
        console.log("Cache lama berhasil dihapus.");

        // --- Proses Inisialisasi Paralel ---
        
        // Janji 1: Preload semua aset lokal (gambar & suara)
        const localAssetsPromise = preloadAssets();

        // Janji 2: Download semua data dari Supabase
        const remoteDataPromise = (async () => {
          console.log("Memulai download data dari server...");

          setStatus('Menghubungi server...');
          const { data: categories, error: catError } = await supabase.from('categories').select('*');
          if (catError) throw new Error(`Gagal mengambil kategori: ${catError.message}`);
          
          const { data: animals, error: animError } = await supabase.from('animals').select('*');
          if (animError) throw new Error(`Gagal mengambil hewan: ${animError.message}`);
          
          console.log(`Ditemukan ${animals.length} data hewan.`);
          
          if (!animals || animals.length === 0) {
            console.warn("PERINGATAN: Tidak ada data hewan dari Supabase.");
            return; // Selesaikan janji ini jika tidak ada hewan
          }

          const animalsWithLocalPaths = [];
          const totalDownloads = animals.length;
          for (let i = 0; i < animals.length; i++) {
            const animal = animals[i];
            setStatus(`Mengunduh data... (${i + 1}/${totalDownloads})`);
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
          console.log("Download dan penyimpanan data remote selesai.");
        })();
        
        // Tunggu KEDUA proses (preload aset lokal dan download data remote) selesai
        setStatus('Menyelesaikan persiapan...');
        await Promise.all([localAssetsPromise, remoteDataPromise]);
        
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