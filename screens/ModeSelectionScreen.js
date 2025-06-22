import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated, ImageBackground, StatusBar } from 'react-native';
import { playClickSound } from '../utils/audioHelper';

const ModeSelectionScreen = ({ navigation }) => {
  const scaleBelajar = useRef(new Animated.Value(1)).current;
  const scaleKuis = useRef(new Animated.Value(1)).current;

  // Nilai animasi opacity untuk berkedip
  const opacityBelajar = useRef(new Animated.Value(1)).current;
  const opacityKuis = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fungsi berkedip setiap 3 detik
    const startBlinking = (opacityRef) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityRef, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacityRef, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.delay(2000), // Tunggu 2 detik sebelum berkedip lagi
        ])
      ).start();
    };

    startBlinking(opacityBelajar);
    startBlinking(opacityKuis);
  }, []);

  const handlePress = (scaleAnim, action) => {
    playClickSound();
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
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
        <Animated.View
          style={[
            styles.buttonWrapper,
            styles.belajarWrapper,
            { transform: [{ scale: scaleBelajar }], opacity: opacityBelajar }
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePress(scaleBelajar, actionBelajar)}
            style={[styles.button, styles.belajarButton]}
            activeOpacity={1}
          >
            <Image source={require('../assets/images/buttons/button-belajar.png')} style={styles.buttonText} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonWrapper,
            styles.kuisWrapper,
            { transform: [{ scale: scaleKuis }], opacity: opacityKuis }
          ]}
        >
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
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  belajarWrapper: {
    top: '35%',
  },
  kuisWrapper: {
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
