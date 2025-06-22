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
      position.setValue(0); 
      // Animasikan dari 0 ke 1
      Animated.timing(position, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        // Jika animasi selesai, panggil kembali fungsi ini untuk loop
        if (finished) {
          startAnimation();
        }
      });
    };
    // Tunda sedikit animasi awal berdasarkan startOffset agar tidak muncul bersamaan
    const initialDelay = duration * startOffset;
    const timer = setTimeout(startAnimation, initialDelay);

    return () => clearTimeout(timer); // Cleanup timer

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
    <ImageBackground
      source={source}
      style={styles.background}
      resizeMode="cover"
    >
      {/* --- UKURAN DAN JUMLAH AWAN DIPERBARUI DI SINI --- */}

      {/* Awan 1 (Besar, di depan, lebih cepat) */}
      <AnimatedCloud 
        image={require('../assets/images/animations/cloud1.png')} 
        duration={35000} // Durasi 35 detik
        startOffset={0}   // Mulai dari awal
        top={60}
        size={220}        // Ukuran diperbesar
      />

      {/* Awan 2 (Sedang, di tengah, paling lambat) */}
      <AnimatedCloud 
        image={require('../assets/images/animations/cloud2.png')} 
        duration={70000} // Durasi 70 detik (sangat lambat)
        startOffset={0.6} // Mulai agak jauh di depan
        top={120}
        size={180}        // Ukuran diperbesar
      />
      
      {/* Awan 3 (Kecil, di belakang, kecepatan sedang) - ASET BARU */}
      <AnimatedCloud 
        image={require('../assets/images/animations/cloud3.png')} 
        duration={50000} // Durasi 50 detik
        startOffset={0.3} // Mulai sedikit di depan
        top={40}
        size={160}        // Ukuran diperbesar
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
    opacity: 0.9, // Sedikit lebih jelas
  },
});

export default AnimatedBackground;