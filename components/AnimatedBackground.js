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
    // Kita gunakan 'source' yang dikirimkan melalui props
    <ImageBackground
      source={source}
      style={styles.background} // Style sekarang akan membuatnya selalu di belakang
      resizeMode="cover"
    >
      {/* Awan-awan akan ditampilkan di atas gambar latar belakang ini */}
      <AnimatedCloud 
        image={require('../assets/images/animations/cloud1.png')} 
        duration={35000}
        startOffset={0}
        top={60}
        size={220}
      />
      <AnimatedCloud 
        image={require('../assets/images/animations/cloud2.png')} 
        duration={70000}
        startOffset={0.6}
        top={120}
        size={180}
      />
      <AnimatedCloud 
        image={require('../assets/images/animations/cloud3.png')} 
        duration={50000}
        startOffset={0.3}
        top={40}
        size={160}
      />
      
      {/* 'children' sekarang tidak lagi digunakan karena background ini akan
          selalu berada di belakang semua elemen lain di layar pemanggilnya.
          Kita bisa menghapusnya, atau membiarkannya jika ada kasus penggunaan lain.
          Untuk keamanan, kita biarkan saja. */}
      {children}
    </ImageBackground>
  );
};

// Stylesheet yang diperbarui dengan zIndex
const styles = StyleSheet.create({
  background: {
    // KUNCI UTAMA: Membuat komponen ini menutupi seluruh layar
    // dan berada di lapisan paling bawah.
    ...StyleSheet.absoluteFillObject,
    zIndex: -1, // Paksa untuk selalu menjadi lapisan paling belakang
  },
  cloud: {
    position: 'absolute',
    resizeMode: 'contain',
    opacity: 0.9,
  },
});

export default AnimatedBackground;