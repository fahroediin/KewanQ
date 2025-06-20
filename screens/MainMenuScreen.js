import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import CustomButton from '../components/CustomButton.js';
import { Audio } from 'expo-av';

const MainMenuScreen = ({ navigation }) => {
  const [sound, setSound] = useState();

  // Fungsi untuk memutar suara selamat datang
  async function playWelcomeSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('../assets/audio/selamat-datang.mp3') // Pastikan file ini ada
    );
    setSound(sound);
    
    console.log('Playing Sound');
    await sound.playAsync(); 
  }

  useEffect(() => {
    playWelcomeSound();
    
    // Unload suara saat komponen tidak lagi ditampilkan
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, []);


  return (
    <ImageBackground source={require('../assets/background-main.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>KewanQ</Text>
        <Text style={styles.subtitle}>Ayo Belajar Mengenal Hewan!</Text>
        <View style={styles.buttonContainer}>
          <CustomButton 
            title="Mulai Belajar" 
            onPress={() => navigation.navigate('Category')} 
            color="#FF9800" // Warna oranye
          />
          {/* Anda bisa menambahkan tombol lain di sini, misal "Kuis" */}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Overlay agar teks mudah dibaca
  },
  title: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#386641',
    fontFamily: 'sans-serif-condensed', // Contoh font
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