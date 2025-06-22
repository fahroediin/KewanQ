// File: screens/ModeSelectionScreen.js

import React, { useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated, ImageBackground, StatusBar } from 'react-native';
import { playClickSound } from '../utils/audioHelper';

const ModeSelectionScreen = ({ navigation }) => {
  const scaleBelajar = useRef(new Animated.Value(1)).current;
  const scaleKuis = useRef(new Animated.Value(1)).current;

  const handlePress = (scaleAnim, action) => {
    playClickSound();
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 80, useNativeDriver: true }),
    ]).start(() => {
      action();
    });
  };

  const actionBelajar = () => navigation.navigate('Category');
  const actionKuis = () => alert('Fitur Kuis Segera Hadir!');

  return (
    <ImageBackground
      source={require('../assets/images/backgrounds/mode-selection-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" />
      <Image source={require('../assets/images/kewanq-logo.png')} style={styles.logo} />

      <View style={styles.container}>
        {/* Tombol BELAJAR dengan posisi absolut */}
        <Animated.View style={[styles.buttonWrapper, styles.belajarWrapper, { transform: [{ scale: scaleBelajar }] }]}>
          <TouchableOpacity
            onPress={() => handlePress(scaleBelajar, actionBelajar)}
            activeOpacity={0.9}
          >
            {/* Gunakan Image untuk menampilkan aset tombol Anda */}
            <Image 
              source={require('../assets/images/buttons/button-belajar.png')} 
              style={styles.buttonImage} 
            />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Tombol KUIS dengan posisi absolut */}
        <Animated.View style={[styles.buttonWrapper, styles.kuisWrapper, { transform: [{ scale: scaleKuis }] }]}>
          <TouchableOpacity
            onPress={() => handlePress(scaleKuis, actionKuis)}
            activeOpacity={0.9}
          >
            {/* Gunakan Image untuk menampilkan aset tombol Anda */}
            <Image 
              source={require('../assets/images/buttons/button-kuis.png')} 
              style={styles.buttonImage} 
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

// Stylesheet yang disederhanakan untuk tombol berbasis gambar
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  logo: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 120,
    height: 40,
    resizeMode: 'contain',
    zIndex: 10,
  },
  buttonWrapper: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    // Efek miring dipertahankan di sini
    transform: [{ rotate: '-4deg' }],
    // Efek bayangan diterapkan di sini
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    // Elevation untuk Android tidak akan terlalu terlihat pada gambar transparan
  },
  belajarWrapper: {
    top: '38%', 
  },
  kuisWrapper: {
    top: '52%',
  },
  buttonImage: {
    // Style untuk gambar tombolnya
    width: 300, // Sesuaikan lebar gambar tombol Anda
    height: 100, // Sesuaikan tinggi gambar tombol Anda
    resizeMode: 'contain', // Penting agar gambar tidak terdistorsi
  },
  // Style lama untuk .button, .belajarButton, .kuisButton, dan .buttonText sudah dihapus
  // karena tidak lagi diperlukan.
});

export default ModeSelectionScreen;