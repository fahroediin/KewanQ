// File: screens/MainMenuScreen.js

// 1. Impor useGameStore
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import CustomButton from '../components/CustomButton.js';
import { Audio } from 'expo-av';
import { useGameStore } from '../store/gameStore'; // <-- PENTING: Import ini

const MainMenuScreen = ({ navigation }) => {
  const [sound, setSound] = useState();
  // 2. Ambil fungsi playBackgroundMusic dari store
  const playBackgroundMusic = useGameStore(state => state.playBackgroundMusic);

  // Fungsi untuk memutar suara selamat datang (tetap sama)
  async function playWelcomeSound() {
    try {
      console.log('Memuat Suara Selamat Datang');
      const { sound: welcomeSound } = await Audio.Sound.createAsync(
         require('../assets/audio/selamat-datang.mp3')
      );
      setSound(welcomeSound); // Simpan objek suara ke state lokal
      
      console.log('Memutar Suara Selamat Datang');
      await welcomeSound.playAsync(); 
    } catch (error) {
      console.error("Gagal memutar suara selamat datang:", error);
    }
  }

  useEffect(() => {
    // Panggil kedua fungsi audio saat komponen pertama kali muncul
    playWelcomeSound();
    playBackgroundMusic(); // <-- PENTING: Panggil fungsi musik di sini
    
    // Fungsi cleanup ini hanya untuk suara "selamat datang" agar tidak bocor memori.
    // Musik latar akan terus berjalan.
    return () => {
      if (sound) {
        console.log('Unloading Suara Selamat Datang');
        sound.unloadAsync();
      }
    };
  }, []); // Dependency array kosong memastikan ini hanya berjalan sekali


  return (
    <ImageBackground 
      source={require('../assets/images/backgrounds/main-menu-bg.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>KewanQ</Text>
        <Text style={styles.subtitle}>Ayo Belajar Mengenal Hewan!</Text>
        <View style={styles.buttonContainer}>
          <CustomButton 
            title="Mulai Belajar" 
            onPress={() => navigation.navigate('Category')} 
            color="#FF9800" // Warna oranye
          />
        </View>
      </View>
    </ImageBackground>
  );
};

// Stylesheet tetap sama, tidak perlu diubah
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#386641',
    fontFamily: 'sans-serif-condensed',
  },
  subtitle: {
    fontSize: 20,
    color: '#6A994E',
    marginBottom: 50,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  }
});

export default MainMenuScreen;