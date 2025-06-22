// File: screens/MainMenuScreen.js

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Animated, StatusBar, Image } from 'react-native';
import { Audio } from 'expo-av';
import { useGameStore } from '../store/gameStore';
import AnimatedBackground from '../components/AnimatedBackground';
import { playClickSound } from '../utils/audioHelper';

const MainMenuScreen = ({ navigation }) => {
  const [welcomeSound, setWelcomeSound] = useState();
  const playBackgroundMusic = useGameStore(state => state.playBackgroundMusic);
  
  const scaleValue = useRef(new Animated.Value(1)).current;

  // --- useEffect YANG DIPERBARUI UNTUK ALUR AUDIO BERURUTAN ---
  useEffect(() => {
    let isMounted = true;

    async function setupSounds() {
      // Hanya jalankan di mobile
      if (Platform.OS === 'web') {
        // Di web, musik akan diputar saat tombol ditekan
        return;
      }
      
      try {
        console.log("Memuat Suara Selamat Datang...");
        const { sound } = await Audio.Sound.createAsync(
           require('../assets/audio/selamat-datang.mp3')
        );

        if (isMounted) {
          setWelcomeSound(sound);
          
          // Tambahkan listener untuk mendeteksi kapan suara selesai
          sound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) {
              console.log("Suara Selamat Datang Selesai. Memutar Musik Latar...");
              // Setelah selesai, putar musik latar
              playBackgroundMusic();
              // Hapus listener agar tidak berjalan lagi
              sound.setOnPlaybackStatusUpdate(null);
            }
          });

          await sound.playAsync();
          console.log("Suara Selamat Datang Diputar.");
        }
      } catch (error) { 
        console.error("Gagal memutar suara selamat datang, mencoba putar musik latar langsung.", error);
        playBackgroundMusic(); // Fallback: jika suara selamat datang gagal, langsung putar musik
      }
    }
    
    setupSounds();
    
    // Fungsi cleanup
    return () => {
      isMounted = false;
      if (welcomeSound) {
        console.log("Unloading Suara Selamat Datang.");
        welcomeSound.unloadAsync();
      }
    };
  }, []); // Array dependency kosong memastikan ini hanya berjalan sekali

  // Fungsi yang dipanggil saat tombol "Mulai" ditekan
  const handleStartPress = async () => {
    // Hentikan suara selamat datang jika masih berjalan
    if (welcomeSound) {
      await welcomeSound.stopAsync();
      await welcomeSound.unloadAsync();
    }
    
    playClickSound();
    playBackgroundMusic(); // Pastikan musik tetap diputar jika pengguna menekan tombol sebelum suara selamat datang selesai
    
    navigation.replace('ModeSelection');
  };
  
  const onPressIn = () => Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();

  return (
    <AnimatedBackground>
      <StatusBar barStyle="dark-content" />
      <View style={styles.stage}>
        <Image source={require('../assets/images/layers/tanah-dan-semak.png')} style={styles.tanahLayer} />
        <Image source={require('../assets/images/kewanq-logo.png')} style={styles.logoLayer} />
        <View style={styles.buttonContainer}>
          <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
            <TouchableOpacity style={styles.startButton} onPress={handleStartPress} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={0.8}>
              <Text style={styles.startButtonText}>Mulai</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </AnimatedBackground>
  );
};

// Stylesheet (tidak ada perubahan)
const styles = StyleSheet.create({
  stage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tanahLayer: { position: 'absolute', bottom: 0, width: '100%', height: '60%', resizeMode: 'cover' },
  logoLayer: { width: '90%', height: '50%', resizeMode: 'contain', marginBottom: '20%' },
  buttonContainer: {},
  startButton: { backgroundColor: '#ff6b6b', paddingVertical: 18, paddingHorizontal: 70, borderRadius: 50, borderWidth: 4, borderColor: 'white', borderBottomWidth: 10, borderBottomColor: '#c94a4a', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 10 },
  startButtonText: { color: 'white', fontSize: 32, fontWeight: 'bold', letterSpacing: 1.5 },
});

export default MainMenuScreen;