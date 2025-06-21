// File: components/AnimatedBackground.js

import React, { useRef, useEffect } from 'react';
import { ImageBackground, Animated, Easing, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const AnimatedCloud = ({ image, duration, startOffset, top, size }) => {
  // Gunakan startOffset untuk nilai awal agar posisi awan berbeda
  const position = useRef(new Animated.Value(startOffset)).current;

  useEffect(() => {
    // Fungsi animasi yang akan berulang
    const startAnimation = () => {
      // Atur ulang posisi ke nilai awal
      position.setValue(startOffset); 
      Animated.timing(position, {
        toValue: 1, // Animasikan dari nilai awal ke 1
        duration: duration * (1 - startOffset), // Sesuaikan durasi berdasarkan posisi awal
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        // Jika animasi selesai, panggil kembali fungsi ini untuk loop
        if (finished) {
          startAnimation();
        }
      });
    };

    startAnimation();
  }, [duration, startOffset]);

  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [width + size, -size], // Bergerak dari kanan penuh ke kiri penuh
  });

  return (
    <Animated.Image
      source={image}
      style={[
        styles.cloud, 
        { 
          width: size, 
          height: size * 0.6, // Asumsi rasio awan
          top, 
          transform: [{ translateX }] 
        }
      ]}
    />
  );
};

const AnimatedBackground = ({ children, source }) => {
  return (
    // Gunakan 'source' yang dikirimkan melalui props
    <ImageBackground
      source={source}
      style={styles.background}
      resizeMode="cover" // <-- PENTING: Gunakan 'cover' agar memenuhi layar
    >
      {/* Awan-awan akan ditampilkan di atas gambar latar belakang ini */}
      <AnimatedCloud 
        image={require('../assets/images/animations/cloud1.png')} 
        duration={40000}
        startOffset={0}
        top={50} // Naikkan posisi awan sedikit
        size={150} 
      />
      <AnimatedCloud 
        image={require('../assets/images/animations/cloud2.png')} 
        duration={60000}
        startOffset={0.5}
        top={90} // Naikkan posisi awan sedikit
        size={120} 
      />
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cloud: {
    position: 'absolute',
    resizeMode: 'contain',
    opacity: 0.8,
  },
});

export default AnimatedBackground;