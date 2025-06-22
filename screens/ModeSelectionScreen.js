// File: screens/ModeSelectionScreen.js

import React, { useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated, ImageBackground, StatusBar } from 'react-native';
import { playClickSound } from '../utils/audioHelper';

const ModeSelectionScreen = ({ navigation }) => {
  // Animasi untuk setiap tombol
  const scaleBelajar = useRef(new Animated.Value(1)).current;
  const scaleKuis = useRef(new Animated.Value(1)).current;

  // Fungsi wrapper untuk menangani klik
  const handlePress = (scaleAnim, action) => {
    playClickSound();
    
    // Animasi tekan
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      // Jalankan aksi setelah animasi selesai
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
            style={[styles.button, styles.belajarButton]}
            activeOpacity={1}
          >
            <Image source={require('../assets/images/buttons/button-belajar.png')} style={styles.buttonText} />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Tombol KUIS dengan posisi absolut */}
        <Animated.View style={[styles.buttonWrapper, styles.kuisWrapper, { transform: [{ scale: scaleKuis }] }]}>
          <TouchableOpacity
            onPress={() => handlePress(scaleKuis, actionKuis)}
            style={[styles.button, styles.kuisButton]}
            activeOpacity={1}
          >
            <Image source={require('../assets/images/buttons/button-kuis.png')} style={styles.buttonText} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

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
    // Semua wrapper tombol sekarang absolut
    position: 'absolute',
    width: '100%', // Ambil lebar penuh untuk mempermudah pemusatan
    alignItems: 'center', // Pusatkan tombol di dalam wrapper
  },
  belajarWrapper: {
    // Atur posisi dari atas
    top: '35%', 
  },
  kuisWrapper: {
    // Atur posisi dari atas, lebih rendah dari tombol belajar
    top: '52%',
  },
  button: {
    width: 400,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-7deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
  },
  buttonText: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
});

export default ModeSelectionScreen;