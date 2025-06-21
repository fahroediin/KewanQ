// File: screens/MainMenuScreen.js

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { Audio } from 'expo-av';
import { useGameStore } from '../store/gameStore';
import AnimatedBackground from '../components/AnimatedBackground'; // Pastikan komponen ini diimpor

const MainMenuScreen = ({ navigation }) => {
  const [sound, setSound] = useState();
  const playBackgroundMusic = useGameStore(state => state.playBackgroundMusic);
  
  const scaleValue = useRef(new Animated.Value(1)).current;

  // useEffect untuk suara selamat datang (logika tidak diubah)
  useEffect(() => {
    async function playWelcomeSound() {
      if (Platform.OS === 'web') return;
      try {
        const { sound: welcomeSound } = await Audio.Sound.createAsync(
           require('../assets/audio/selamat-datang.mp3')
        );
        setSound(welcomeSound);
        await welcomeSound.playAsync(); 
      } catch (error) {
        console.error("Gagal memutar suara selamat datang:", error);
      }
    }
    
    playWelcomeSound();
    
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  const handleStartPress = () => {
    playBackgroundMusic();
    navigation.navigate('ModeSelection');
  };
  
  const onPressIn = () => Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();

  return (
    // Panggil AnimatedBackground dan kirimkan source gambar latar belakang utama
    <AnimatedBackground 
      source={require('../assets/images/backgrounds/main-menu-bg.png')}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Container ini akan berada DI ATAS AnimatedBackground */}
      <View style={styles.container}>
        
        {/* Tombol "Mulai" dengan gaya custom */}
        <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Mulai</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </AnimatedBackground>
  );
};

// Stylesheet yang dirancang ulang untuk layout ini
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Mendorong semua konten ke bawah
    alignItems: 'center',       // Memusatkan konten secara horizontal
  },
  startButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 18,
    paddingHorizontal: 70,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
    borderBottomWidth: 10,
    borderBottomColor: '#c94a4a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    marginBottom: '20%', // Jarak tombol dari bagian paling bawah layar
  },
  startButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
});

export default MainMenuScreen;