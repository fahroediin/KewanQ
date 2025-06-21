// File: screens/MainMenuScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform } from 'react-native';
import CustomButton from '../components/CustomButton.js';
import { Audio } from 'expo-av';
import { useGameStore } from '../store/gameStore';

const MainMenuScreen = ({ navigation }) => {
  const [sound, setSound] = useState(); // State lokal untuk suara selamat datang
  const playBackgroundMusic = useGameStore(state => state.playBackgroundMusic);

  // Fungsi untuk memutar suara selamat datang
  async function playWelcomeSound() {
    // Cek platform: Hanya putar otomatis di mobile (bukan web)
    if (Platform.OS === 'web') {
      console.log("Autoplay suara selamat datang dilewati di web.");
      return;
    }

    try {
      console.log('Memuat Suara Selamat Datang (Mobile)');
      const { sound: welcomeSound } = await Audio.Sound.createAsync(
         require('../assets/audio/selamat-datang.mp3')
      );
      setSound(welcomeSound);
      
      await welcomeSound.playAsync(); 
      console.log('Memutar Suara Selamat Datang (Mobile)');
    } catch (error) {
      console.error("Gagal memutar suara selamat datang:", error);
    }
  }

  // useEffect hanya berjalan sekali saat komponen dimuat
  useEffect(() => {
    playWelcomeSound(); // Coba putar suara selamat datang
    
    // Fungsi cleanup untuk membersihkan suara selamat datang dari memori
    return () => {
      if (sound) {
        console.log('Unloading Suara Selamat Datang');
        sound.unloadAsync();
      }
    };
  }, []); // Array kosong berarti ini hanya berjalan sekali

  // Fungsi yang dipanggil saat tombol "Mulai Belajar" ditekan
  const handleStartPress = () => {
    // Ini adalah interaksi pertama pengguna, jadi aman untuk memulai musik
    playBackgroundMusic();
    
    // Setelah itu, navigasi ke layar kategori
    navigation.navigate('Category');
  };

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
            onPress={handleStartPress} // Gunakan fungsi handle yang baru
            color="#FF9800"
          />
        </View>
      </View>
    </ImageBackground>
  );
};

// Stylesheet tetap sama
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