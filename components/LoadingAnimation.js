// File: components/LoadingAnimation.js

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Komponen sekarang menerima 'iconName' sebagai prop
const LoadingAnimation = ({ iconName }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animasi putar
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animasi denyut (besar-kecil)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.8, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.overlay}>
      <Animated.View style={{ transform: [{ rotate }, { scale }] }}>
        {/* Tampilkan ikon berdasarkan prop 'iconName' */}
        {/* Jika tidak ada iconName, tampilkan 'paw' sebagai default */}
        <MaterialCommunityIcons 
          name={iconName || 'paw'} 
          size={80} 
          color="white" 
        />
      </Animated.View>
      <Text style={styles.loadingText}>Mempersiapkan...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  loadingText: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoadingAnimation;